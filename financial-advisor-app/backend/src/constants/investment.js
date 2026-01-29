const INVESTMENT_RULES = {
  // 50-30-20 budgeting rule
  NEEDS_PERCENTAGE: 0.50,
  WANTS_PERCENTAGE: 0.30,
  SAVINGS_PERCENTAGE: 0.20,
  
  // Emergency fund calculation
  EMERGENCY_FUND_MONTHS: 6,
  
  // Age-based equity allocation
  MAX_EQUITY_PERCENTAGE: 100,
  
  // Minimum investment amounts
  MIN_SIP_AMOUNT: 500,
  MIN_EMERGENCY_FUND: 10000,
}

const USER_ROLES = {
  STUDENT: 'student',
  PROFESSIONAL: 'professional'
}

const INVESTMENT_TYPES = {
  EQUITY: 'equity',
  DEBT: 'debt',
  EMERGENCY: 'emergency'
}

module.exports = {
  INVESTMENT_RULES,
  USER_ROLES,
  INVESTMENT_TYPES
}