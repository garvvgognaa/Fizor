const prisma = require('../config/database')
const InvestmentService = require('./investmentService')

class ProfileService {
  static async createOrUpdateSalaryProfile(userId, profileData) {
    const { monthlyIncome, monthlyExpenses, age } = profileData
    
    // Check if profile already exists
    const existingProfile = await prisma.salaryProfile.findFirst({
      where: { userId }
    })
    
    let salaryProfile
    
    if (existingProfile) {
      // Update existing profile
      salaryProfile = await prisma.salaryProfile.update({
        where: { id: existingProfile.id },
        data: {
          monthlyIncome,
          monthlyExpenses,
          age
        }
      })
    } else {
      // Create new profile
      salaryProfile = await prisma.salaryProfile.create({
        data: {
          userId,
          monthlyIncome,
          monthlyExpenses,
          age
        }
      })
    }
    
    return salaryProfile
  }
    static async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    const salaryProfile = await prisma.salaryProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    const latestRecommendation = await prisma.investmentRecommendation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    return {
      user,
      salaryProfile,
      latestRecommendation
    }
  }
}