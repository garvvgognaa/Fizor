const express = require('express')
const { body } = require('express-validator')
const AuthController = require('../controllers/authController')
const { handleValidationErrors } = require('../middlewares/validation')

const router = express.Router()

// Register validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'professional'])
    .withMessage('Role must be either student or professional'),
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
// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Routes
router.post('/register', registerValidation, handleValidationErrors, AuthController.register)
router.post('/login', loginValidation, handleValidationErrors, AuthController.login)

module.exports = router