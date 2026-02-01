const { verifyToken } = require('../utils/jwt')
const { sendError } = require('../utils/response')
const prisma = require('../config/database')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', 401)
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    })

    if (!user) {
      return sendError(res, 'User not found', 401)
    }

    req.user = user
    next()
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    })

    if (user) {
      req.user = user
    }
    next()
  } catch (error) {
    // If token is invalid, we still proceed but without req.user
    next()
  }
}

module.exports = { authenticate, optionalAuthenticate }