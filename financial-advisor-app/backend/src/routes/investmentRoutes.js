const express = require('express')
const InvestmentController = require('../controllers/investmentController')
const { authenticate, optionalAuthenticate } = require('../middlewares/auth')

const router = express.Router()

// Basic calculation endpoint (required outputs only)
// Optional authentication - saves to DB if authenticated
router.post('/calculate', optionalAuthenticate, InvestmentController.calculate)

// Detailed calculation endpoint (with optimization suggestions)
// For dashboard view with additional analytics
router.post('/calculate-detailed', optionalAuthenticate, InvestmentController.getDetailedRecommendation)

// Protected route to get previous recommendations
router.get('/recommendation', authenticate, InvestmentController.getRecommendation)

module.exports = router