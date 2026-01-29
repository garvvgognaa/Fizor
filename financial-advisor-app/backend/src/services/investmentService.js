/**
 * Investment Service - Implements 6 Core Investment Rules
 * All calculations are backend-only, deterministic, and rule-based
 */

class InvestmentService {
  // Goal-based allocation rules (Rule 5)
  static GOAL_ALLOCATION = {
    'Car': { timeframe: '3-5 years', equity: 30, debt: 70 },
    'House': { timeframe: '7-10 years', equity: 60, debt: 40 },
    'Education': { timeframe: '10+ years', equity: 70, debt: 30 },
    'Wealth creation': { equity: 85, debt: 15 },
    'Capital protection': { equity: 15, debt: 85 },
    // Aliases for common variations
    'Buy a car': { timeframe: '3-5 years', equity: 30, debt: 70 },
    'Buy a house': { timeframe: '7-10 years', equity: 60, debt: 40 },
    'Higher education': { timeframe: '10+ years', equity: 70, debt: 30 },
    'Child education': { timeframe: '10+ years', equity: 70, debt: 30 },
    'Capital protection (low risk)': { equity: 15, debt: 85 }
  }

  static RISK_LIMITS = {
    'low': 30,
    'Low': 30,
    'medium': 60,
    'Medium': 60,
    'high': 90,
    'High': 90
  }
    /**
   * RULE 1: 50-30-20 Budget Rule
   * 50% of monthly income → needs
   * 30% → wants
   * 20% → investments
   */
  static calculate50_30_20(monthlyIncome) {
    return {
      needsAmount: monthlyIncome * 0.5,
      wantsAmount: monthlyIncome * 0.3,
      investmentAmount: monthlyIncome * 0.2
    }
  }

  /**
   * RULE 2: Emergency Fund Rule
   * Emergency fund = 6 × monthly expenses
   * Must be calculated and stored separately
   * Must not be included in investment amount
   */
  static calculateEmergencyFund(monthlyExpenses) {
    return monthlyExpenses * 6
  }
}