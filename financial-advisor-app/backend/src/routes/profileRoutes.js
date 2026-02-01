const express = require('express')
const { body } = require('express-validator')
const ProfileController = require('../controllers/profileController')
const { authenticate } = require('../middlewares/auth')
const { handleValidationErrors } = require('../middlewares/validation')

const router = express.Router()

// Salary profile validation rules
const salaryProfileValidation = [
  body('monthlyIncome')
    .isFloat({ min: 0 })
    .withMessage('Monthly income must be a positive number'),
  body('monthlyExpenses')
    .isFloat({ min: 0 })
    .withMessage('Monthly expenses must be a positive number'),
  body('age')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
]

// Routes (all protected)
router.post('/salary', authenticate, salaryProfileValidation, handleValidationErrors, ProfileController.createSalaryProfile)
router.patch('/status', authenticate, ProfileController.updateUserStatus)
router.get('/me', authenticate, ProfileController.getUserProfile)

module.exports = router