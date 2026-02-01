const { validationResult } = require('express-validator')
const { sendError } = require('../utils/response')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }))
    
    return sendError(res, 'Validation failed', 400, errorMessages)
  }
  
  next()
}

module.exports = { handleValidationErrors }