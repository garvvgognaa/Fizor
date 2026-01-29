require('dotenv').config()
const app = require('./app')
const prisma = require('./config/database')

const PORT = process.env.PORT || 3000

// Database connection test
async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log(' Database connected successfully')
  } catch (error) {
    console.error(' Database connection failed:', error.message)
    process.exit(1)
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log('\n🔄 Shutting down gracefully...')
  
  try {
    await prisma.$disconnect()
    console.log(' Database disconnected')
    process.exit(0)
  } catch (error) {
    console.error(' Error during shutdown:', error.message)
    process.exit(1)
  }
}

// Start server
async function startServer() {
  try {
    await connectDatabase()
    
    const server = app.listen(PORT, () => {
      console.log(`Financial Advisor API running on port ${PORT}`)
      console.log(`API Documentation: http://localhost:${PORT}`)
      console.log(`Health Check: http://localhost:${PORT}/api/health`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    // Handle graceful shutdown
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    
    return server
  } catch (error) {
    console.error(' Failed to start server:', error.message)
    process.exit(1)
  }
}

// Start the application
if (require.main === module) {
  startServer()
}

module.exports = { startServer }