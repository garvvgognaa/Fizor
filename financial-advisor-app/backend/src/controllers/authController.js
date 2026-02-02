const UserService = require('../services/userService')
const { sendSuccess, sendError } = require('../utils/response')

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, age, monthlyIncome, monthlyExpenses, monthlyInvestment, profession } = req.body
      console.log('📝 Registration attempt:', { email })

      const result = await UserService.createUser({
        email,
        password,
        age,
        monthlyIncome,
        monthlyExpenses,
        monthlyInvestment,
        profession
      })

      console.log('User registered successfully:', result.user.id)
      sendSuccess(res, result, 'User registered successfully', 201)
    } catch (error) {
      console.error('Registration failed:', error.message)
      if (error.message === 'User already exists with this email') {
        return sendError(res, error.message, 409)
      }
      sendError(res, 'Registration failed', 500)
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      const result = await UserService.authenticateUser(email, password)

      sendSuccess(res, result, 'Login successful')
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return sendError(res, error.message, 401)
      }
      sendError(res, 'Login failed', 500)
    }
  }
}

module.exports = AuthController