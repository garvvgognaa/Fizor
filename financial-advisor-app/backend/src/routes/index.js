const express = require('express')
const authRoutes = require('./authRoutes')
const profileRoutes = require('./profileRoutes')
const investmentRoutes = require('./investmentRoutes')

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Financial Advisor API is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
router.use('/investment', investmentRoutes)

module.exports = router