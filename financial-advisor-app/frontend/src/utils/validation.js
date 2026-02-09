export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters long'
  return null
}

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

export const validateNumber = (value, fieldName, min = 0) => {
  if (value === '' || value === null || value === undefined) return null
  const num = parseFloat(value)
  if (isNaN(num)) return `${fieldName} must be a valid number`
  if (num < min) return `${fieldName} must be at least ${min}`
  return null
}

export const validatePositiveNumber = (value, fieldName) => {
  return validateNumber(value, fieldName, 0.01)
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}