const express = require('express')
const { body } = require('express-validator')
const AuthController = require('../controllers/authController')
const { handleValidationErrors } = require('../middlewares/validation')

const router = express.Router()

// Register validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be between 18 and 120'),
  body('monthlyIncome')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly income must be a positive number'),
  body('monthlyExpenses')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly expenses must be a positive number'),
  body('monthlyInvestment')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly investment must be a positive number'),
]
