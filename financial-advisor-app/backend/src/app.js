const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174' ],
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.use('/api', routes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Financial Advisor API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      profile: {
        salary: 'POST /api/profile/salary',
        me: 'GET /api/profile/me'
      },
      investment: {
        recommendation: 'GET /api/investment/recommendation'
      }
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error)

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

module.exports = app