# 📘 Fizor — Backend API Documentation

> **Fizor** is a rule-based Financial Advisor application. This document explains **every file** in the backend, what each line of code does, and how files call each other — so anyone can pick this up and understand the entire system.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [How the Server Starts (Boot Flow)](#4-how-the-server-starts-boot-flow)
5. [Request Lifecycle](#5-request-lifecycle)
6. [File-by-File Detailed Explanation](#6-file-by-file-detailed-explanation)
   - [Entry Points](#61-entry-points)
   - [Config](#62-config)
   - [Constants](#63-constants)
   - [Routes](#64-routes)
   - [Middlewares](#65-middlewares)
   - [Controllers](#66-controllers)
   - [Services](#67-services)
   - [Utils (Utilities)](#68-utils-utilities)
   - [Prisma Schema (Database)](#69-prisma-schema-database)
   - [Test Files](#610-test-files)
7. [API Endpoints Reference](#7-api-endpoints-reference)
8. [Investment Rules Engine (6 Rules)](#8-investment-rules-engine-6-rules)
9. [Environment Variables](#9-environment-variables)
10. [Database Schema](#10-database-schema)
11. [How to Run](#11-how-to-run)

---

## 1. Project Overview

Fizor's backend is a **REST API** that:
- Registers and authenticates users (JWT-based)
- Collects user financial profiles (income, expenses, age, goals, risk appetite)
- Calculates **personalized investment recommendations** using 6 deterministic rules
- Stores recommendations in a PostgreSQL database (via Prisma ORM)
- Returns budget splits, SIP amounts, equity/debt allocation, and optimization suggestions

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework for REST API |
| **Prisma ORM** | Database access & schema management |
| **PostgreSQL (Neon DB)** | Cloud-hosted relational database |
| **JSON Web Tokens (JWT)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **express-validator** | Request body validation |
| **helmet** | HTTP security headers |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |

---

## 3. Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database models & relations
├── src/
│   ├── server.js              # Entry point — starts Express server & connects DB
│   ├── app.js                 # Express app configuration (middleware, routes, error handlers)
│   ├── config/
│   │   └── database.js        # Prisma client singleton
│   ├── constants/
│   │   └── investment.js      # Investment rule constants (50-30-20 percentages, etc.)
│   ├── controllers/
│   │   ├── authController.js       # Handles register & login requests
│   │   ├── profileController.js    # Handles salary profile & user status requests
│   │   └── investmentController.js # Handles investment calculation requests
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── validation.js      # express-validator error handler middleware
│   ├── routes/
│   │   ├── index.js           # Main router — mounts all sub-routers under /api
│   │   ├── authRoutes.js      # /api/auth/* route definitions + validation rules
│   │   ├── profileRoutes.js   # /api/profile/* route definitions + validation rules
│   │   └── investmentRoutes.js# /api/investment/* route definitions
│   ├── services/
│   │   ├── userService.js     # User CRUD & authentication business logic
│   │   ├── profileService.js  # Profile & salary CRUD business logic
│   │   └── investmentService.js # Core investment calculation engine (6 rules)
│   └── utils/
│       ├── jwt.js             # JWT sign & verify helpers
│       ├── password.js        # bcrypt hash & compare helpers
│       └── response.js        # Standardized API response helpers
├── test-db.js                 # Script to test database connection & inspect data
├── test-investment-rules.js   # Script to unit-test all 6 investment rules
├── package.json               # Dependencies & npm scripts
└── .env                       # Environment variables (not committed to git)
```

---

## 4. How the Server Starts (Boot Flow)

Below is the exact sequence of what happens when you run `npm run dev` (or `node src/server.js`):

```
1.  server.js  →  loads .env via dotenv.config()
2.  server.js  →  requires ./app  (which creates the Express app)
3.  server.js  →  requires ./config/database  (creates Prisma client)
4.  server.js  →  calls connectDatabase()
    └── Calls prisma.$connect() to verify DB connection
    └── If fails → exits process with code 1
5.  server.js  →  calls app.listen(PORT)
    └── Server starts listening on PORT (default 3000)
6.  server.js  →  registers SIGTERM/SIGINT handlers for graceful shutdown
    └── On shutdown → calls prisma.$disconnect()
```

**Diagram:**

```
npm run dev
    │
    ▼
server.js (entry point)
    │
    ├── require('dotenv').config()     →  loads .env into process.env
    ├── require('./app')               →  creates Express app (see app.js)
    ├── require('./config/database')   →  creates PrismaClient instance
    │
    ▼
connectDatabase()  →  prisma.$connect()
    │
    ▼
app.listen(PORT)   →  HTTP server is live
```

---

## 5. Request Lifecycle

Every HTTP request follows this path:

```
Client Request (e.g. POST /api/auth/register)
    │
    ▼
app.js  →  Helmet (security headers)
    │
    ▼
app.js  →  CORS check (allowed origins from FRONTEND_URL env var)
    │
    ▼
app.js  →  Body parser (JSON, up to 10MB)
    │
    ▼
app.js  →  app.use('/api', routes)   →   routes/index.js
    │
    ▼
routes/index.js  →  routes to the correct sub-router:
    ├── /api/auth/*       →  authRoutes.js
    ├── /api/profile/*    →  profileRoutes.js
    └── /api/investment/* →  investmentRoutes.js
    │
    ▼
Sub-router applies:
    ├── Validation rules  (express-validator)
    ├── validation.js middleware  (checks for errors)
    └── auth.js middleware  (verifies JWT if protected route)
    │
    ▼
Controller method (e.g. AuthController.register)
    │
    ▼
Service layer (e.g. UserService.createUser)
    │
    ▼
Prisma ORM  →  PostgreSQL database
    │
    ▼
Response sent via utils/response.js  →  { success, message, data }
```

---

## 6. File-by-File Detailed Explanation

### 6.1 Entry Points

---

#### `src/server.js` — Server Entry Point

**Purpose:** This is the **main entry point** of the entire backend. It loads environment variables, connects to the database, starts the HTTP server, and handles graceful shutdown.

| Line(s) | What It Does |
|---|---|
| `1` | `require('dotenv').config()` — Reads the `.env` file and loads all key-value pairs (like `DATABASE_URL`, `JWT_SECRET`) into `process.env` |
| `2` | `const app = require('./app')` — Imports the fully configured Express application from `app.js` |
| `3` | `const prisma = require('./config/database')` — Imports the Prisma client singleton from `config/database.js` |
| `5` | `const PORT = process.env.PORT \|\| 3000` — Sets the port from env or defaults to 3000 |
| `8-16` | **`connectDatabase()`** — Tries `prisma.$connect()`. If it fails, logs the error and calls `process.exit(1)` to stop the server |
| `19-30` | **`gracefulShutdown()`** — Called when SIGTERM or SIGINT is received (e.g., Ctrl+C). Disconnects Prisma cleanly before exiting |
| `33-53` | **`startServer()`** — Orchestrates boot: calls `connectDatabase()`, then `app.listen(PORT)`, then registers shutdown signal handlers |
| `56-58` | `if (require.main === module)` — Only starts the server if this file is run directly (not imported by tests) |
| `60` | `module.exports = { startServer }` — Exports `startServer` for testing or programmatic use |

**Calls →** `app.js`, `config/database.js`

---

#### `src/app.js` — Express App Configuration

**Purpose:** Creates and configures the Express application. Sets up all middleware (security, CORS, body parsing), mounts API routes, and defines error handlers.

| Line(s) | What It Does |
|---|---|
| `1-4` | Imports Express, CORS, Helmet, and the main routes module |
| `6` | `const app = express()` — Creates the Express application instance |
| `9` | `app.use(helmet())` — Adds security-related HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.) |
| `12-23` | **CORS configuration** — Reads `FRONTEND_URL` from env (defaults to `https://fiizor.vercel.app`), splits by comma to allow multiple origins. Allows requests with no origin (Postman, mobile apps). Sets `credentials: true` for cookie support |
| `26-27` | **Body parsing** — Parses JSON and URL-encoded request bodies, with a 10MB size limit |
| `30` | `app.use('/api', routes)` — Mounts ALL API routes under the `/api` prefix. This calls `routes/index.js` |
| `33-53` | **Root endpoint** (`GET /`) — Returns a JSON with API version info and a list of all available endpoints (serves as built-in API documentation) |
| `56-61` | **404 handler** — Catches any request that doesn't match a defined route and returns `{ success: false, message: 'Route not found' }` |
| `64-72` | **Global error handler** — Catches any unhandled errors thrown in routes/controllers. In development mode, includes the error stack trace. Always returns `{ success: false, message }` |
| `74` | `module.exports = app` — Exports the app for `server.js` to call `.listen()` |

**Calls →** `routes/index.js`

---

### 6.2 Config

---

#### `src/config/database.js` — Prisma Client Singleton

**Purpose:** Creates a **single instance** of PrismaClient that is shared across the entire application. This avoids opening multiple database connections.

| Line(s) | What It Does |
|---|---|
| `1` | `const { PrismaClient } = require('@prisma/client')` — Imports the auto-generated Prisma client |
| `3-5` | Creates a new `PrismaClient` instance. In development mode, logs all queries, info, warnings, and errors. In production, only logs errors |
| `7` | `module.exports = prisma` — Exports the single instance. Every file that does `require('./config/database')` gets the **same** Prisma client |

**Used by →** `server.js`, `middlewares/auth.js`, `controllers/investmentController.js`, `controllers/profileController.js`, `services/userService.js`, `services/profileService.js`

---

### 6.3 Constants

---

#### `src/constants/investment.js` — Investment Constants

**Purpose:** Defines all the **magic numbers** and enums used in the investment calculation engine, so they are easy to find and change.

| Constant | Value | Meaning |
|---|---|---|
| `INVESTMENT_RULES.NEEDS_PERCENTAGE` | `0.50` | 50% of income goes to needs (50-30-20 rule) |
| `INVESTMENT_RULES.WANTS_PERCENTAGE` | `0.30` | 30% of income goes to wants |
| `INVESTMENT_RULES.SAVINGS_PERCENTAGE` | `0.20` | 20% of income goes to savings/investments |
| `INVESTMENT_RULES.EMERGENCY_FUND_MONTHS` | `6` | Emergency fund = 6 months of expenses |
| `INVESTMENT_RULES.MAX_EQUITY_PERCENTAGE` | `100` | Maximum allowed equity allocation |
| `INVESTMENT_RULES.MIN_SIP_AMOUNT` | `500` | Minimum monthly SIP amount (₹500) |
| `INVESTMENT_RULES.MIN_EMERGENCY_FUND` | `10000` | Minimum emergency fund (₹10,000) |
| `USER_ROLES` | `{ STUDENT, PROFESSIONAL }` | Enum for user roles |
| `INVESTMENT_TYPES` | `{ EQUITY, DEBT, EMERGENCY }` | Enum for investment categories |

**Used by →** Referenced conceptually in `investmentService.js` (note: the service currently uses hardcoded values inline)

---

### 6.4 Routes

---

#### `src/routes/index.js` — Main Router (Route Aggregator)

**Purpose:** Acts as the **central router**. It imports all sub-routers and mounts them under the `/api` prefix. Also defines the health-check endpoint.

| Line(s) | What It Does |
|---|---|
| `1-4` | Imports Express and all three sub-route files |
| `6` | Creates a new Express Router instance |
| `9-15` | **`GET /api/health`** — Health check endpoint. Returns `{ success: true, message, timestamp }`. Used by monitoring/uptime tools |
| `18` | `router.use('/auth', authRoutes)` — All routes in `authRoutes.js` become `/api/auth/*` |
| `19` | `router.use('/profile', profileRoutes)` — All routes in `profileRoutes.js` become `/api/profile/*` |
| `20` | `router.use('/investment', investmentRoutes)` — All routes in `investmentRoutes.js` become `/api/investment/*` |
| `22` | Exports the router. This is imported by `app.js` line 4 |

**Calls →** `authRoutes.js`, `profileRoutes.js`, `investmentRoutes.js`
**Called by →** `app.js`

---

#### `src/routes/authRoutes.js` — Authentication Routes

**Purpose:** Defines the `POST /api/auth/register` and `POST /api/auth/login` endpoints with their **validation rules**.

| Line(s) | What It Does |
|---|---|
| `1-4` | Imports Express, express-validator's `body()`, `AuthController`, and `handleValidationErrors` middleware |
| `9-44` | **`registerValidation`** — An array of validation rules: name (required, min 2 chars), email (valid email), password (min 6 chars), role (must be 'student' or 'professional'), and optional fields (age 18-120, monthlyIncome ≥ 0, monthlyExpenses ≥ 0, monthlyInvestment ≥ 0) |
| `46-54` | **`loginValidation`** — An array of validation rules: email (valid email), password (required) |
| `57` | **`POST /register`** → runs `registerValidation` → runs `handleValidationErrors` → calls `AuthController.register` |
| `58` | **`POST /login`** → runs `loginValidation` → runs `handleValidationErrors` → calls `AuthController.login` |

**Request flow for `/api/auth/register`:**
```
POST /api/auth/register
    → registerValidation (express-validator checks each field)
    → handleValidationErrors (middlewares/validation.js — if errors, returns 400)
    → AuthController.register (controllers/authController.js)
    → UserService.createUser (services/userService.js)
    → Prisma creates user in DB
    → Returns { user, token }
```

**Calls →** `controllers/authController.js`, `middlewares/validation.js`

---

#### `src/routes/profileRoutes.js` — Profile Routes

**Purpose:** Defines endpoints for managing user profiles. **All routes are protected** (require JWT authentication).

| Line(s) | What It Does |
|---|---|
| `1-5` | Imports Express, express-validator, `ProfileController`, `authenticate` middleware, and `handleValidationErrors` |
| `10-20` | **`salaryProfileValidation`** — Validates monthlyIncome (float ≥ 0), monthlyExpenses (float ≥ 0), age (integer 18-100) |
| `23` | **`POST /api/profile/salary`** → `authenticate` → `salaryProfileValidation` → `handleValidationErrors` → `ProfileController.createSalaryProfile` |
| `24` | **`PATCH /api/profile/status`** → `authenticate` → `ProfileController.updateUserStatus` — Updates `usageReason` and `professionalStatus` |
| `25` | **`GET /api/profile/me`** → `authenticate` → `ProfileController.getUserProfile` — Returns user profile + salary + latest recommendation |

**Calls →** `controllers/profileController.js`, `middlewares/auth.js`, `middlewares/validation.js`

---

#### `src/routes/investmentRoutes.js` — Investment Routes

**Purpose:** Defines endpoints for investment calculations. Uses **optional authentication** for calculation endpoints (saves to DB if logged in, but also works without login).

| Line(s) | What It Does |
|---|---|
| `1-3` | Imports Express, `InvestmentController`, and both auth middlewares (`authenticate` and `optionalAuthenticate`) |
| `9` | **`POST /api/investment/calculate`** → `optionalAuthenticate` → `InvestmentController.calculate` — Main calculation endpoint. If user is authenticated, saves results to DB |
| `13` | **`POST /api/investment/calculate-detailed`** → `optionalAuthenticate` → `InvestmentController.getDetailedRecommendation` — Same calculation + optimization suggestions for dashboard view |
| `16` | **`GET /api/investment/recommendation`** → `authenticate` (required) → `InvestmentController.getRecommendation` — Retrieves the latest saved recommendation from DB |

**Calls →** `controllers/investmentController.js`, `middlewares/auth.js`

---

### 6.5 Middlewares

---

#### `src/middlewares/auth.js` — Authentication Middleware

**Purpose:** Provides two middleware functions for JWT-based authentication. One is **strict** (rejects if no token), the other is **optional** (proceeds even without token).

##### `authenticate` (strict)

| Line(s) | What It Does |
|---|---|
| `5-30` | 1) Reads `Authorization` header → 2) Checks it starts with `Bearer ` → 3) Extracts the token string → 4) Calls `verifyToken(token)` from `utils/jwt.js` to decode and verify → 5) Uses the decoded `userId` to query the database via `prisma.user.findUnique()` → 6) If user exists, attaches `req.user = { id, email }` and calls `next()` → 7) If any step fails, returns 401 error |

##### `optionalAuthenticate` (optional)

| Line(s) | What It Does |
|---|---|
| `32-56` | Same as `authenticate`, but: if no `Authorization` header is present, it simply calls `next()` (proceeds without setting `req.user`). If the token is invalid, it also proceeds without error. This allows endpoints to work for both logged-in and anonymous users |

**Calls →** `utils/jwt.js` (verifyToken), `config/database.js` (prisma), `utils/response.js` (sendError)
**Called by →** `profileRoutes.js`, `investmentRoutes.js`

---

#### `src/middlewares/validation.js` — Validation Error Handler

**Purpose:** Checks the results of `express-validator` validation rules and returns a structured error response if any validation fails.

| Line(s) | What It Does |
|---|---|
| `1` | Imports `validationResult` from `express-validator` — this collects all validation errors from the request |
| `2` | Imports `sendError` from `utils/response.js` |
| `4-17` | **`handleValidationErrors`** — Calls `validationResult(req)` to get errors. If there are errors, maps them to `[{ field, message }]` format and returns a 400 response. If no errors, calls `next()` to proceed to the controller |

**Calls →** `utils/response.js`
**Called by →** `authRoutes.js`, `profileRoutes.js`

---

### 6.6 Controllers

---

#### `src/controllers/authController.js` — Authentication Controller

**Purpose:** Handles **register** and **login** HTTP requests. It extracts data from `req.body`, delegates business logic to `UserService`, and sends the response.

##### `AuthController.register(req, res)`

| Line(s) | What It Does |
|---|---|
| `7` | Destructures all registration fields from `req.body` |
| `10-20` | Calls `UserService.createUser()` with all the extracted fields. This → hashes the password, checks for duplicates, creates the DB record, generates a JWT |
| `23` | Calls `sendSuccess(res, result, 'User registered successfully', 201)` — sends 201 Created |
| `26-28` | If error is "User already exists", sends 409 Conflict. Otherwise sends 500 |

##### `AuthController.login(req, res)`

| Line(s) | What It Does |
|---|---|
| `35` | Extracts `email` and `password` from `req.body` |
| `37` | Calls `UserService.authenticateUser(email, password)` — finds user, compares password hash, generates JWT |
| `39` | On success, sends `{ user, token }` with 200 OK |
| `41-44` | If "Invalid email or password", sends 401. Otherwise 500 |

**Calls →** `services/userService.js`, `utils/response.js`
**Called by →** `authRoutes.js`

---

#### `src/controllers/profileController.js` — Profile Controller

**Purpose:** Handles profile-related requests — saving salary info, getting user profile, and updating onboarding status.

##### `ProfileController.createSalaryProfile(req, res)`

| Line(s) | What It Does |
|---|---|
| `8` | Gets `userId` from `req.user.id` (set by auth middleware) |
| `9` | Extracts `monthlyIncome`, `monthlyExpenses`, `age` from `req.body` |
| `11-15` | Calls `ProfileService.createOrUpdateSalaryProfile()` — creates or updates the salary profile in DB |
| `17` | Sends 201 Created response |

##### `ProfileController.getUserProfile(req, res)`

| Line(s) | What It Does |
|---|---|
| `25-26` | Gets userId, calls `ProfileService.getUserProfile()` |
| `28` | Returns user info, salary profile, and latest investment recommendation |

##### `ProfileController.updateUserStatus(req, res)`

| Line(s) | What It Does |
|---|---|
| `37-38` | Gets userId and extracts `usageReason`, `professionalStatus` from body |
| `41-53` | **Directly uses Prisma** to update the user record with `usageReason` and `professionalStatus`. Returns the updated fields |

**Calls →** `services/profileService.js`, `config/database.js` (direct Prisma), `utils/response.js`
**Called by →** `profileRoutes.js`

---

#### `src/controllers/investmentController.js` — Investment Controller

**Purpose:** The most complex controller. Handles investment calculations, validation, DB persistence, and detailed recommendations with optimization suggestions.

##### `InvestmentController.calculate(req, res)` — Main Calculation

| Line(s) | What It Does |
|---|---|
| `16-22` | Extracts `age`, `monthlyIncome`, `monthlyExpenses`, `riskAppetite`, `goals`, `investmentHorizon` from body |
| `25-44` | **Input validation:** checks required fields exist, parses to numbers, validates ranges (age 18-100, income > 0, expenses ≥ 0) |
| `47` | Ensures `goals` is an array (defaults to `[]`) |
| `50-57` | Calls **`InvestmentService.calculateInvestmentRecommendation()`** — this runs ALL 6 investment rules and returns the complete recommendation object |
| `60-116` | **Builds the response object** with: basic outputs (needs/wants/investment amounts, emergency fund, equity/debt %, SIP amounts), allocation percentages (large/mid/small cap), SIP split by category, goal-wise split, expected returns, 10-year projected value, budget guidance, and monthly savings |
| `119-158` | **If user is authenticated:** updates the user record with latest inputs (via `UserService.updateUser`) and saves the full recommendation to the `investmentRecommendation` table via `prisma.investmentRecommendation.create()` |
| `161` | Sends success response |

##### `InvestmentController.getDetailedRecommendation(req, res)` — Dashboard View

| Line(s) | What It Does |
|---|---|
| `174-191` | Same input extraction and validation as `calculate` |
| `194-200` | Calls `InvestmentService.calculateInvestmentRecommendation()` |
| `203-212` | Checks if user has a `professionalStatus` stored in DB |
| `215-224` | Calls **`InvestmentService.getOptimizationSuggestions()`** — generates personalized financial improvement tips based on expense ratio, investment percentage, risk mismatches, and professional status |
| `226-242` | Returns the full recommendation + optimization suggestions |

##### `InvestmentController.getRecommendation(req, res)` — Get Saved

| Line(s) | What It Does |
|---|---|
| `256` | Gets userId from `req.user` |
| `258-261` | Queries `investmentRecommendation` table for the user's **most recent** saved recommendation (ordered by `createdAt DESC`) |
| `267` | Returns the saved recommendation |

**Calls →** `services/investmentService.js`, `services/userService.js`, `config/database.js`, `utils/response.js`
**Called by →** `investmentRoutes.js`

---

### 6.7 Services

---

#### `src/services/userService.js` — User Service

**Purpose:** Contains all **user-related business logic**: creating users, authenticating users, fetching, and updating users. Acts as the layer between controllers and the database.

##### `UserService.createUser(userData)`

| Step | What It Does |
|---|---|
| 1 | Checks if a user with the same email already exists → throws `'User already exists with this email'` |
| 2 | Hashes the password using `hashPassword()` from `utils/password.js` (bcrypt, 12 salt rounds) |
| 3 | Creates a new user record in the DB via `prisma.user.create()`. Maps `role` to `professionalStatus`. Parses `age`, `monthlyIncome`, `monthlyExpenses`, `monthlyInvestment` to proper types |
| 4 | Generates a JWT token via `generateToken({ userId: user.id })` from `utils/jwt.js` |
| 5 | Returns `{ user, token }` |

##### `UserService.authenticateUser(email, password)`

| Step | What It Does |
|---|---|
| 1 | Finds user by email → if not found, throws `'Invalid email or password'` |
| 2 | Compares the provided password with the hashed one using `comparePassword()` from `utils/password.js` |
| 3 | If mismatch → throws `'Invalid email or password'` |
| 4 | Generates JWT token |
| 5 | Strips the `password` field from user object using destructuring |
| 6 | Returns `{ user: userWithoutPassword, token }` |

##### `UserService.getUserById(userId)`

Fetches a user by ID, returning select fields (no password).

##### `UserService.updateUser(userId, data)`

Updates any user fields. Used by `investmentController.js` to save latest financial inputs.

**Calls →** `config/database.js`, `utils/password.js`, `utils/jwt.js`
**Called by →** `controllers/authController.js`, `controllers/investmentController.js`

---

#### `src/services/profileService.js` — Profile Service

**Purpose:** Handles salary profile CRUD and user profile retrieval.

##### `ProfileService.createOrUpdateSalaryProfile(userId, profileData)`

| Step | What It Does |
|---|---|
| 1 | Checks if a salary profile already exists for this user |
| 2 | If exists → updates it. If not → creates a new one |
| Note | References `prisma.salaryProfile` — this model may exist in an older version of the schema |

##### `ProfileService.getUserProfile(userId)`

| Step | What It Does |
|---|---|
| 1 | Fetches the user record (id, name, email, role) |
| 2 | Fetches the latest salary profile |
| 3 | Fetches the latest investment recommendation |
| 4 | Returns all three bundled together |

##### `ProfileService.generateInvestmentRecommendation(userId)`

Legacy method that generates a recommendation from stored salary profile data.

**Calls →** `config/database.js`, `services/investmentService.js`
**Called by →** `controllers/profileController.js`

---

#### `src/services/investmentService.js` — Investment Service (Core Engine)

**Purpose:** This is the **brain of the application**. It implements all 6 investment rules as pure, deterministic functions. No database calls — pure calculations only.

> Detailed rule explanations are in [Section 8](#8-investment-rules-engine-6-rules)

##### Method Summary

| Method | Rule | What It Does |
|---|---|---|
| `calculate50_30_20(monthlyIncome)` | Rule 1 | Returns `{ needsAmount, wantsAmount, investmentAmount }` — splits income 50/30/20 |
| `calculateEmergencyFund(monthlyExpenses)` | Rule 2 | Returns `monthlyExpenses × 6` |
| `calculateAllocation(age, riskAppetite, goals)` | Rules 3+4+5 | Returns `{ equityPercentage, debtPercentage }` after applying age rule, risk caps, and goal overrides |
| `calculateSIP(investmentAmount, equity%, debt%)` | Rule 6 | Returns `{ monthlySip, equitySip, debtSip }` |
| `calculateEquityBreakdown(equity%, horizon, risk)` | Sub-rule | Returns `{ largeCapPercentage, midCapPercentage, smallCapPercentage }` |
| `calculateInvestmentRecommendation(params)` | **All** | **Orchestrator** — calls all rules in sequence, returns complete recommendation |
| `getOptimizationSuggestions(params)` | Bonus | Returns array of personalized financial suggestions |
| `getGoalWiseSplit(investment, goals)` | Bonus | Splits investment equally among goals |
| `getExpectedReturns()` | Bonus | Returns `{ equity: "10–12%", debt: "6–7%" }` |
| `calculateExpectedValue(monthly, equity%, debt%, years)` | Bonus | Calculates future value using compound interest formula |

**Called by →** `controllers/investmentController.js`, `services/profileService.js`

---

### 6.8 Utils (Utilities)

---

#### `src/utils/jwt.js` — JWT Helper

**Purpose:** Provides two simple functions for working with JSON Web Tokens.

| Function | What It Does |
|---|---|
| `generateToken(payload)` | Calls `jwt.sign()` with the payload, `JWT_SECRET` from env, and expiry (default `'7d'`). Returns the signed JWT string |
| `verifyToken(token)` | Calls `jwt.verify()` to decode and validate the token. Returns the decoded payload (`{ userId, iat, exp }`). Throws if token is expired or tampered |

**Called by →** `services/userService.js` (generateToken), `middlewares/auth.js` (verifyToken)

---

#### `src/utils/password.js` — Password Helper

**Purpose:** Wraps `bcryptjs` for password hashing and comparison.

| Function | What It Does |
|---|---|
| `hashPassword(password)` | Hashes the password with **12 salt rounds** using `bcrypt.hash()`. Returns the hash string (stored in DB) |
| `comparePassword(password, hashedPassword)` | Compares a plain-text password with a stored hash using `bcrypt.compare()`. Returns `true` or `false` |

**Called by →** `services/userService.js`

---

#### `src/utils/response.js` — Response Helper

**Purpose:** Standardizes all API responses so the frontend always gets a consistent JSON shape.

| Function | Response Shape |
|---|---|
| `sendSuccess(res, data, message, statusCode)` | `{ success: true, message: "...", data: {...} }` |
| `sendError(res, message, statusCode, errors)` | `{ success: false, message: "...", errors: [...] }` |

**Called by →** Every controller and middleware

---

### 6.9 Prisma Schema (Database)

---

#### `prisma/schema.prisma` — Database Schema

**Purpose:** Defines the **database structure** using Prisma's schema language. Prisma auto-generates the TypeScript/JavaScript client from this file.

##### `User` model → maps to `users` table

| Field | Type | Description |
|---|---|---|
| `id` | String (CUID) | Primary key, auto-generated |
| `email` | String (unique) | User's email address |
| `password` | String | bcrypt-hashed password |
| `name` | String | User's display name |
| `role` | String? | `'student'` or `'professional'` |
| `age` | Int? | User's age |
| `monthlyIncome` | Float? | Monthly income in ₹ |
| `monthlyExpenses` | Float? | Monthly expenses in ₹ |
| `monthlyInvestment` | Float? | Calculated monthly investment amount |
| `profession` | String? | User's profession |
| `goals` | Json? | Array of goal strings (e.g., `["House", "Car"]`) |
| `riskAppetite` | String? | `'Low'`, `'Medium'`, or `'High'` |
| `investmentHorizon` | String? | `'Short (1–3 years)'`, `'Medium (3–7 years)'`, `'Long (7–10+ years)'` |
| `usageReason` | String? | Why user is using the app |
| `professionalStatus` | String? | User's professional status |
| `createdAt` | DateTime | Auto-set to current time |
| `investmentRecommendations` | Relation | One-to-many with `InvestmentRecommendation` |

##### `InvestmentRecommendation` model → maps to `investment_recommendations` table

| Field | Type | Description |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `userId` | String (FK) | References `User.id`. Cascade delete enabled |
| `goals` | Json | Snapshot of goals at calculation time |
| `riskAppetite` | String | Snapshot of risk appetite |
| `investmentHorizon` | String | Snapshot of investment horizon |
| `strategyType` | String | Always `'Rule-Based Allocation'` |
| `equityPercentage` | Float | Calculated equity % |
| `debtPercentage` | Float | Calculated debt % |
| `largeCapPercentage` | Float | Large cap % |
| `midCapPercentage` | Float | Mid cap % |
| `smallCapPercentage` | Float | Small cap % |
| `emergencyFundAmount` | Float | 6× monthly expenses |
| `monthlySIPAmount` | Float | Total monthly SIP |
| `riskLevel` | String | Same as riskAppetite |
| `goalWiseSplit` | Json | Investment split per goal |
| `expectedReturnRange` | Json | `{ equity: "10–12%", debt: "6–7%" }` |
| `expectedTenYearValue` | Float | Projected portfolio value after 10 years |
| `createdAt` | DateTime | Auto-set |

---

### 6.10 Test Files

---

#### `test-db.js` — Database Connection Test

**Purpose:** A standalone script to verify the database is connected and inspect existing data. Run with `node test-db.js`.

| What It Does |
|---|
| Connects to the database using Prisma |
| Counts users, salary profiles, and investment recommendations |
| Prints sample user data |
| Disconnects cleanly |

---

#### `test-investment-rules.js` — Investment Rules Test Suite

**Purpose:** A standalone test script that verifies all 6 investment rules produce correct outputs. Run with `node test-investment-rules.js`.

| Test | Input | Expected Output |
|---|---|---|
| **Rule 1** | Income = ₹1,00,000 | Needs = ₹50,000, Wants = ₹30,000, Investment = ₹20,000 |
| **Rule 2** | Expenses = ₹25,000 | Emergency Fund = ₹1,50,000 |
| **Rule 3** | Age = 30, Risk = medium | Equity = 60% (min(70, 60)), Debt = 40% |
| **Rule 4** | Low/Med/High risk, Age = 25 | Max equity: 30% / 60% / 90% |
| **Rule 5** | Car goal | 30% equity, 70% debt |
| **Rule 6** | ₹20,000, 70/30 split | SIP = ₹20,000, Equity SIP = ₹14,000, Debt SIP = ₹6,000 |
| **Integration** | All params combined | All output fields present and correct |

---

## 7. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | API info & endpoint listing |
| `GET` | `/api/health` | ❌ | Health check |
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and get JWT token |
| `POST` | `/api/profile/salary` | ✅ Required | Save/update salary profile |
| `PATCH` | `/api/profile/status` | ✅ Required | Update usage reason & professional status |
| `GET` | `/api/profile/me` | ✅ Required | Get full user profile |
| `POST` | `/api/investment/calculate` | 🔄 Optional | Calculate investment recommendation |
| `POST` | `/api/investment/calculate-detailed` | 🔄 Optional | Calculate + optimization suggestions |
| `GET` | `/api/investment/recommendation` | ✅ Required | Get latest saved recommendation |

### Auth Key:
- ❌ = No authentication needed
- ✅ Required = Must send `Authorization: Bearer <token>` header
- 🔄 Optional = Works without auth, but saves to DB if authenticated

---

## 8. Investment Rules Engine (6 Rules)

The investment engine in `investmentService.js` applies these rules **in sequence**:

### Rule 1: 50-30-20 Budget Rule
```
Input:  monthlyIncome
Output: needsAmount     = monthlyIncome × 0.50
        wantsAmount     = monthlyIncome × 0.30
        investmentAmount = monthlyIncome × 0.20
```

### Rule 2: Emergency Fund Rule
```
Input:  monthlyExpenses
Output: emergencyFund = monthlyExpenses × 6
```
> This is calculated and returned separately — it is NOT deducted from the investment amount.

### Rule 3: 100 Minus Age Rule
```
Input:  age
Output: equityPercentage = 100 − age
        debtPercentage   = age
```
> Example: Age 30 → 70% equity, 30% debt

### Rule 4: Risk Appetite Cap
```
Risk Appetite   Max Equity Allowed
───────────────────────────────────
Low             30%
Medium          60%
High            90%
```
> `equityPercentage = min(equityPercentage, riskLimit)`

### Rule 5: Goal-Based Override
```
Goal             Equity / Debt Split
───────────────────────────────────
Car              30 / 70
House            60 / 40
Education        70 / 30
Wealth creation  85 / 15
Capital protection 15 / 85
```
> If multiple goals, the average is taken. Goal allocation **overrides** age-based allocation but still respects risk caps.

### Rule 6: SIP Calculation
```
Input:  investmentAmount, equityPercentage, debtPercentage
Output: monthlySip = investmentAmount
        equitySip  = investmentAmount × (equityPercentage / 100)
        debtSip    = investmentAmount × (debtPercentage / 100)
```

### Equity Breakdown (Sub-Rule)
The equity portion is further split into Large Cap / Mid Cap / Small Cap based on investment horizon:

| Horizon | Large Cap | Mid Cap | Small Cap |
|---|---|---|---|
| Short (1–3 years) | 75% | 20% | 5% |
| Medium (3–7 years) | 60% | 30% | 10% |
| Long (7–10+ years) | 50% | 35% | 15% |

High risk moves +5% to mid/small cap; low risk moves +10% to large cap.

---

## 9. Environment Variables

Create a `.env` file in the `backend/` directory with these variables:

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db?sslmode=require"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Prisma connection string (pooled, for Neon DB) |
| `DATABASE_URL_UNPOOLED` | ✅ | Direct connection string (for migrations) |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | ❌ | Token expiry duration (default: `'7d'`) |
| `PORT` | ❌ | Server port (default: `3000`) |
| `NODE_ENV` | ❌ | `'development'` or `'production'` |
| `FRONTEND_URL` | ❌ | Comma-separated allowed origins for CORS |

---

## 10. Database Schema

```
┌──────────────────────────────────────┐
│               users                  │
├──────────────────────────────────────┤
│ id (PK, CUID)                        │
│ email (UNIQUE)                       │
│ password                             │
│ name                                 │
│ role                                 │
│ age                                  │
│ monthly_income                       │
│ monthly_expenses                     │
│ monthly_investment                   │
│ profession                           │
│ goals (JSON)                         │
│ risk_appetite                        │
│ investment_horizon                   │
│ usage_reason                         │
│ professional_status                  │
│ created_at                           │
├──────────────────────────────────────┤
│          1 ──── * (has many)         │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│     investment_recommendations       │
├──────────────────────────────────────┤
│ id (PK, CUID)                        │
│ user_id (FK → users.id, CASCADE)     │
│ goals (JSON)                         │
│ risk_appetite                        │
│ investment_horizon                   │
│ strategy_type                        │
│ equity_percentage                    │
│ debt_percentage                      │
│ large_cap_percentage                 │
│ mid_cap_percentage                   │
│ small_cap_percentage                 │
│ emergency_fund_amount                │
│ monthly_sip_amount                   │
│ risk_level                           │
│ goal_wise_split (JSON)               │
│ expected_return_range (JSON)         │
│ expected_ten_year_value              │
│ created_at                           │
└──────────────────────────────────────┘
```

---

## 11. How to Run

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon DB account)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your database credentials (see Section 9)

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Start the development server
npm run dev
```

### Available npm Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `node src/server.js` | Start development server |
| `npm start` | `node src/server.js` | Start production server |
| `npm run db:generate` | `prisma generate` | Generate Prisma client from schema |
| `npm run db:push` | `prisma db push` | Push schema changes to database |
| `npm run db:migrate` | `prisma migrate dev` | Create and apply migrations |
| `npm run db:studio` | `prisma studio` | Open Prisma Studio (DB GUI) |

### Testing

```bash
# Test database connection
node test-db.js

# Test investment rules
node test-investment-rules.js
```