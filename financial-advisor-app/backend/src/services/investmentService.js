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
   /**
   * RULE 3 + 4 + 5: Combined Allocation Logic
   * 
   * Rule 3: 100 Minus Age Rule
   * - Equity percentage = 100 − user age
   * - Debt percentage = remaining %
   * 
   * Rule 4: Risk Appetite Rule
   * - Low risk: Max equity 30%
   * - Medium risk: Max equity 60%
   * - High risk: Max equity 90%
   * 
   * Rule 5: Goal-Based Allocation Rule
   * - Goal allocation must override default equity limits when required
   */
  static calculateAllocation(age, riskAppetite, goals = []) {
    // RULE 3: Base allocation using 100 Minus Age
    let equityPercentage = 100 - age
    let debtPercentage = age

    // RULE 4: Apply Risk Appetite Limits
    const riskLimit = this.RISK_LIMITS[riskAppetite] || 60 // Default to medium if unknown

    // Equity must never exceed risk limits
    equityPercentage = Math.min(equityPercentage, riskLimit)
    debtPercentage = 100 - equityPercentage

    // RULE 5: Goal-Based Allocation Override
    // If user has goals, calculate average goal allocation
    if (goals && goals.length > 0) {
      let goalEquityTotal = 0
      let goalDebtTotal = 0
      let validGoalCount = 0

      goals.forEach(goal => {
        const goalRule = this.GOAL_ALLOCATION[goal]
        if (goalRule) {
          goalEquityTotal += goalRule.equity
          goalDebtTotal += goalRule.debt
          validGoalCount++
        }
      })

      // If we found valid goals, use goal-based allocation
      if (validGoalCount > 0) {
        const avgGoalEquity = goalEquityTotal / validGoalCount
        const avgGoalDebt = goalDebtTotal / validGoalCount

        // Goal allocation can override age-based allocation
        equityPercentage = avgGoalEquity
        debtPercentage = avgGoalDebt

        // But still must respect risk appetite limits
        if (equityPercentage > riskLimit) {
          equityPercentage = riskLimit
          debtPercentage = 100 - equityPercentage
        }
      }
    }

    // Final bounds check (equity between 0-100)
    equityPercentage = Math.max(0, Math.min(100, equityPercentage))
    debtPercentage = 100 - equityPercentage

    return {
      equityPercentage: Math.round(equityPercentage * 100) / 100,
      debtPercentage: Math.round(debtPercentage * 100) / 100
    }
  }
  
  /**
   * RULE 6: SIP Calculation Rule
   * - Monthly SIP = investment portion of income
   * - SIP must be split according to final equity/debt allocation
   * - Returns: total SIP, equity SIP, debt SIP
   */
  static calculateSIP(investmentAmount, equityPercentage, debtPercentage) {
    return {
      monthlySip: Math.round(investmentAmount * 100) / 100,
      equitySip: Math.round(investmentAmount * (equityPercentage / 100) * 100) / 100,
      debtSip: Math.round(investmentAmount * (debtPercentage / 100) * 100) / 100
    }
  }
}