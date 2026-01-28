# Financial Advisor Backend API

A production-ready Node.js backend for the Financial Advisor web application.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **MySQL** - Database
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **express-validator** - Input validation

## Features

- ✅ User authentication (register/login)
- ✅ JWT-based authorization
- ✅ Password hashing with bcrypt
- ✅ Salary profile management
- ✅ Investment recommendation engine
- ✅ 50-30-20 budgeting rule implementation
- ✅ Age-based equity allocation
- ✅ Emergency fund calculation
- ✅ Input validation and error handling
- ✅ CORS support
- ✅ Security headers with Helmet

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Update `.env` file with your database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/financial_advisor"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profile (Protected)
- `POST /api/profile/salary` - Create/update salary profile
- `GET /api/profile/me` - Get user profile

### Investment (Protected)
- `GET /api/investment/recommendation` - Get investment recommendation

### Utility
- `GET /api/health` - Health check
- `GET /` - API documentation

## Investment Logic

### 50-30-20 Budgeting Rule
- **50%** - Needs (essential expenses)
- **30%** - Wants (lifestyle expenses)
- **20%** - Savings and investments

### Equity Allocation Formula
- **Equity %** = 100 - Age (minimum 20%)
- **Debt %** = 100 - Equity %

### Emergency Fund
- **Amount** = 6 × Monthly Expenses (minimum ₹10,000)

## Database Schema

### User
- id, name, email, password, role, createdAt

### SalaryProfile
- id, userId, monthlyIncome, monthlyExpenses, age, createdAt

### InvestmentRecommendation
- id, userId, needsAmount, wantsAmount, investmentAmount, emergencyFund, equityPercentage, debtPercentage, createdAt

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── constants/
│   │   └── investment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   └── investmentController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── investmentRoutes.js
│   │   └── index.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── profileService.js
│   │   └── investmentService.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── response.js
│   ├── app.js
│   └── server.js
├── .env
└── package.json
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- SQL injection protection via Prisma

## Error Handling

- Global error handler
- Validation error responses
- Structured error messages
- Development vs production error details