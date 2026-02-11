const prisma = require('../config/database')
const { hashPassword, comparePassword } = require('../utils/password')
const { generateToken } = require('../utils/jwt')

class UserService {
  static async createUser(userData) {
    const { email, password, name, role, age, monthlyIncome, monthlyExpenses, monthlyInvestment, profession } = userData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        professionalStatus: role,
        age: age ? parseInt(age) : null,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        monthlyExpenses: monthlyExpenses ? parseFloat(monthlyExpenses) : null,
        monthlyInvestment: monthlyInvestment ? parseFloat(monthlyInvestment) : null,
        profession
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        monthlyIncome: true,
        monthlyExpenses: true,
        monthlyInvestment: true,
        profession: true,
        createdAt: true
      }
    })

    // Generate token
    const token = generateToken({ userId: user.id })

    return { user, token }
  }

  static async authenticateUser(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Generate token
    const token = generateToken({ userId: user.id })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  }

  static async getUserById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        monthlyIncome: true,
        monthlyExpenses: true,
        monthlyInvestment: true,
        profession: true,
        goals: true,
        riskAppetite: true,
        investmentHorizon: true,
        createdAt: true
      }
    })
  }

  static async updateUser(userId, data) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        monthlyIncome: true,
        monthlyExpenses: true,
        monthlyInvestment: true,
        profession: true,
        goals: true,
        riskAppetite: true,
        investmentHorizon: true,
        createdAt: true
      }
    })
  }
}

module.exports = UserService