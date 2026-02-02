const InvestmentService = require('../services/investmentService')
const UserService = require('../services/userService')
const prisma = require('../config/database')
const { sendSuccess, sendError } = require('../utils/response')

class InvestmentController {
  /**
   * Calculate investment recommendation based on 6 investment rules
   * Expects: age, monthlyIncome, monthlyExpenses, riskAppetite, goals
   * Returns: needsAmount, wantsAmount, investmentAmount, emergencyFund,
   *          equityPercentage, debtPercentage, monthlySip, equitySip, debtSip
   */
  static async calculate(req, res) {
    try {
      const {
        age,
        monthlyIncome,
        monthlyExpenses,
        riskAppetite,
        goals,
        investmentHorizon
      } = req.body

      // Validate required inputs
      if (!age || !monthlyIncome || !monthlyExpenses || !riskAppetite) {
        return sendError(res, 'Missing required fields: age, monthlyIncome, monthlyExpenses, riskAppetite', 400)
      }

      // Validate data types
      const ageNum = parseInt(age)
      const incomeNum = parseFloat(monthlyIncome)
      const expensesNum = parseFloat(monthlyExpenses)

      if (isNaN(ageNum) || isNaN(incomeNum) || isNaN(expensesNum)) {
        return sendError(res, 'Invalid data types for age, monthlyIncome, or monthlyExpenses', 400)
      }

      if (ageNum < 18 || ageNum > 100) {
        return sendError(res, 'Age must be between 18 and 100', 400)
      }

      if (incomeNum <= 0 || expensesNum < 0) {
        return sendError(res, 'Income must be positive and expenses must be non-negative', 400)
      }

      // Ensure goals is an array
      const goalsArray = Array.isArray(goals) ? goals : []

      // Calculate investment recommendation using all 6 rules
      const recommendation = InvestmentService.calculateInvestmentRecommendation({
        age: ageNum,
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        riskAppetite: riskAppetite,
        goals: goalsArray,
        investmentHorizon: investmentHorizon || 'Long (7–10+ years)'
      })

      // Prepare comprehensive response for frontend
      const result = {
        // Basic outputs (required by 6 rules)
        needsAmount: recommendation.needsAmount,
        wantsAmount: recommendation.wantsAmount,
        investmentAmount: recommendation.investmentAmount,
        emergencyFund: recommendation.emergencyFund,
        equityPercentage: recommendation.equityPercentage,
        debtPercentage: recommendation.debtPercentage,
        monthlySip: recommendation.monthlySip,
        equitySip: recommendation.equitySip,
        debtSip: recommendation.debtSip,

        // User inputs (for display)
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        age: ageNum,
        goals: goalsArray,
        riskAppetite: riskAppetite,
        investmentHorizon: investmentHorizon || 'Long (7–10+ years)',

        // Equity breakdown
        allocationPercentages: {
          equity: recommendation.equityPercentage,
          debt: recommendation.debtPercentage,
          largeCap: recommendation.largeCapPercentage,
          midCap: recommendation.midCapPercentage,
          smallCap: recommendation.smallCapPercentage
        },

        // SIP breakdown
        monthlySIPSplit: {
          largeCap: recommendation.largeCapSIP,
          midCap: recommendation.midCapSIP,
          smallCap: recommendation.smallCapSIP,
          debt: recommendation.debtSIPAmount
        },

        // Additional details
        monthlySIPAmount: recommendation.monthlySip,
        emergencyFundAmount: recommendation.emergencyFund,
        strategyType: 'Rule-Based Allocation',
        riskLevel: riskAppetite,
        goalWiseSplit: InvestmentService.getGoalWiseSplit(recommendation.investmentAmount, goalsArray),
        expectedReturns: InvestmentService.getExpectedReturns(),
        expectedTenYearValue: InvestmentService.calculateExpectedValue(
          recommendation.investmentAmount,
          recommendation.equityPercentage,
          recommendation.debtPercentage,
          10
        ),
        budgetGuidance: {
          needs: recommendation.needsAmount,
          wants: recommendation.wantsAmount,
          investments: recommendation.investmentAmount
        },
        monthlySavings: incomeNum - expensesNum - recommendation.investmentAmount
      }

      // Store in database if user is authenticated
      if (req.user && req.user.id) {
        const userId = req.user.id

        // Update user profile with latest inputs
        await UserService.updateUser(userId, {
          age: ageNum,
          monthlyIncome: incomeNum,
          monthlyExpenses: expensesNum,
          monthlyInvestment: recommendation.investmentAmount,
          goals: goalsArray,
          riskAppetite: riskAppetite,
          investmentHorizon: investmentHorizon || 'Long (7–10+ years)'
        })

        // Save recommendation to database
        await prisma.investmentRecommendation.create({
          data: {
            userId: userId,
            goals: goalsArray,
            riskAppetite: riskAppetite,
            investmentHorizon: investmentHorizon || 'Long (7–10+ years)',
            strategyType: 'Rule-Based Allocation',
            equityPercentage: recommendation.equityPercentage,
            debtPercentage: recommendation.debtPercentage,
            largeCapPercentage: recommendation.largeCapPercentage,
            midCapPercentage: recommendation.midCapPercentage,
            smallCapPercentage: recommendation.smallCapPercentage,
            emergencyFundAmount: recommendation.emergencyFund,
            monthlySIPAmount: recommendation.monthlySip,
            riskLevel: riskAppetite,
            goalWiseSplit: InvestmentService.getGoalWiseSplit(recommendation.investmentAmount, goalsArray),
            expectedReturnRange: InvestmentService.getExpectedReturns(),
            expectedTenYearValue: InvestmentService.calculateExpectedValue(
              recommendation.investmentAmount,
              recommendation.equityPercentage,
              recommendation.debtPercentage,
              10
            )
          }
        })
      }

      sendSuccess(res, result, 'Investment calculation completed successfully')
    } catch (error) {
      console.error('Calculation failed:', error)
      sendError(res, 'Failed to calculate investment recommendation', 500)
    }
  }

  /**
   * Get detailed recommendation with optimization suggestions
   * This is for the dashboard view with additional analytics
   */
  static async getDetailedRecommendation(req, res) {
    try {
      const {
        age,
        monthlyIncome,
        monthlyExpenses,
        riskAppetite,
        goals,
        profession,
        investmentHorizon
      } = req.body

      if (!age || !monthlyIncome || !monthlyExpenses || !riskAppetite) {
        return sendError(res, 'Missing required fields', 400)
      }

      const ageNum = parseInt(age)
      const incomeNum = parseFloat(monthlyIncome)
      const expensesNum = parseFloat(monthlyExpenses)
      const goalsArray = Array.isArray(goals) ? goals : []

      // Calculate base recommendation
      const recommendation = InvestmentService.calculateInvestmentRecommendation({
        age: ageNum,
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        riskAppetite: riskAppetite,
        goals: goalsArray
      })

      // Get user's professional status for optimization suggestions
      let userProfessionalStatus = profession
      if (req.user && req.user.id) {
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { professionalStatus: true }
        })
        if (user?.professionalStatus) {
          userProfessionalStatus = user.professionalStatus
        }
      }

      // Calculate optimization suggestions
      const optimizationSuggestions = InvestmentService.getOptimizationSuggestions({
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        monthlyInvestment: recommendation.investmentAmount,
        emergencyFundAmount: recommendation.emergencyFund,
        currentSavings: 0,
        professionalStatus: userProfessionalStatus,
        riskAppetite: riskAppetite,
        equityPercentage: recommendation.equityPercentage
      })

      const result = {
        ...recommendation,
        optimizationSuggestions,
        goalWiseSplit: InvestmentService.getGoalWiseSplit(recommendation.investmentAmount, goalsArray),
        expectedReturns: InvestmentService.getExpectedReturns(),
        expectedTenYearValue: InvestmentService.calculateExpectedValue(
          recommendation.investmentAmount,
          recommendation.equityPercentage,
          recommendation.debtPercentage,
          10
        ),
        budgetGuidance: {
          needs: recommendation.needsAmount,
          wants: recommendation.wantsAmount,
          investments: recommendation.investmentAmount
        }
      }

      sendSuccess(res, result, 'Detailed recommendation generated successfully')
    } catch (error) {
      console.error('Detailed calculation failed:', error)
      sendError(res, 'Failed to generate detailed recommendation', 500)
    }
  }

  /**
   * Get the latest saved recommendation for authenticated user
   */
  static async getRecommendation(req, res) {
    try {
      const userId = req.user.id

      const recommendation = await prisma.investmentRecommendation.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      if (!recommendation) {
        return sendError(res, 'No previous recommendations found', 404)
      }

      sendSuccess(res, recommendation, 'Latest investment recommendation retrieved successfully')
    } catch (error) {
      console.error('Failed to retrieve recommendation:', error)
      sendError(res, 'Failed to retrieve investment recommendation', 500)
    }
  }
}

module.exports = InvestmentController