const ProfileService = require('../services/profileService')
const prisma = require('../config/database')
const { sendSuccess, sendError } = require('../utils/response')

class ProfileController {
  static async createSalaryProfile(req, res) {
    try {
      const userId = req.user.id
      const { monthlyIncome, monthlyExpenses, age } = req.body

      const salaryProfile = await ProfileService.createOrUpdateSalaryProfile(userId, {
        monthlyIncome: parseFloat(monthlyIncome),
        monthlyExpenses: parseFloat(monthlyExpenses),
        age: parseInt(age)
      })

      sendSuccess(res, salaryProfile, 'Salary profile saved successfully', 201)
    } catch (error) {
      sendError(res, 'Failed to save salary profile', 500)
    }
  }

  static async getUserProfile(req, res) {
    try {
      const userId = req.user.id

      const profile = await ProfileService.getUserProfile(userId)

      sendSuccess(res, profile, 'Profile retrieved successfully')
    } catch (error) {
      sendError(res, 'Failed to retrieve profile', 500)
    }
  }

  static async updateUserStatus(req, res) {
    try {
      const userId = req.user.id
      const { usageReason, professionalStatus } = req.body

      // Update user with onboarding status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          usageReason,
          professionalStatus
        },
        select: {
          id: true,
          email: true,
          usageReason: true,
          professionalStatus: true
        }
      })

      sendSuccess(res, updatedUser, 'User status updated successfully')
    } catch (error) {
      console.error('Error updating user status:', error)
      sendError(res, 'Failed to update user status', 500)
    }
  }
}

module.exports = ProfileController