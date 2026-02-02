// Test script to verify database operations
// Run with: node test-db.js

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Check if tables exist
    const users = await prisma.user.findMany()
    const profiles = await prisma.salaryProfile.findMany()
    const recommendations = await prisma.investmentRecommendation.findMany()
    
    console.log(`📊 Database Status:`)
    console.log(`   Users: ${users.length}`)
    console.log(`   Salary Profiles: ${profiles.length}`)
    console.log(`   Investment Recommendations: ${recommendations.length}`)
    
    if (users.length > 0) {
      console.log('\n👥 Sample Users:')
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`)
      })
    }
    
    console.log('\n Database test completed successfully')
    
  } catch (error) {
    console.error(' Database test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()