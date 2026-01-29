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
}