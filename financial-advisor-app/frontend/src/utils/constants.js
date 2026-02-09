export const USER_TYPES = {
  STUDENT: 'student',
  PROFESSIONAL: 'professional'
}

export const EXPENSE_CATEGORIES = {
  HOUSING: 'housing',
  FOOD: 'food',
  TRANSPORTATION: 'transportation',
  UTILITIES: 'utilities',
  ENTERTAINMENT: 'entertainment',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  OTHER: 'other'
}

export const INVESTMENT_TYPES = {
  EMERGENCY_FUND: 'Emergency Fund',
  MUTUAL_FUNDS: 'Mutual Funds',
  SIP: 'SIP in Mutual Funds',
  PPF: 'PPF/ELSS',
  FIXED_DEPOSITS: 'Fixed Deposits',
  SKILL_DEVELOPMENT: 'Skill Development'
}

export const PRIORITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
}

export const FORM_STEPS = [
  'User Type',
  'Salary',
  'Expenses',
  'Results'
]

export const INCOME_SOURCES = {
  STUDENT: [
    { value: 'part-time-job', label: 'Part-time Job' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelancing', label: 'Freelancing' },
    { value: 'family-support', label: 'Family Support' },
    { value: 'scholarship', label: 'Scholarship' }
  ],
  PROFESSIONAL: [
    { value: 'full-time-job', label: 'Full-time Job' },
    { value: 'business', label: 'Business' },
    { value: 'freelancing', label: 'Freelancing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'multiple-sources', label: 'Multiple Sources' }
  ]
}