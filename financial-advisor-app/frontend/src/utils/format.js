export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return `${currency}0`
  return `${currency}${parseFloat(amount).toLocaleString('en-IN')}`
}

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${parseFloat(value).toFixed(decimals)}%`
}

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0'
  return parseFloat(value).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}