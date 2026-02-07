import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress/StepProgress'
import ResultCard from '../../components/ResultCard/ResultCard'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import './InvestmentResult.css'

function InvestmentResult() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  const steps = ['User Type', 'Salary', 'Expenses', 'Results']

  useEffect(() => {
    calculateRecommendations()
  }, [])

  const calculateRecommendations = () => {
    // Simulate API call
    setTimeout(() => {
      const userType = localStorage.getItem('userType')
      const salaryData = JSON.parse(localStorage.getItem('salaryData') || '{}')
      const expenseData = JSON.parse(localStorage.getItem('expenseData') || '{}')

      const monthlyIncome = parseFloat(salaryData.monthlyIncome || 0) + parseFloat(salaryData.additionalIncome || 0)
      const totalExpenses = Object.values(expenseData).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
      const surplus = monthlyIncome - totalExpenses

      const recommendations = generateRecommendations(userType, monthlyIncome, totalExpenses, surplus)
      setResults(recommendations)
      setLoading(false)
    }, 2000)
  }

  const generateRecommendations = (userType, income, expenses, surplus) => {
    const recommendations = {
      surplus,
      income,
      expenses,
      savingsRate: surplus > 0 ? ((surplus / income) * 100).toFixed(1) : 0,
      investments: []
    }

    if (surplus > 0) {
      if (userType === 'student') {
        recommendations.investments = [
          {
            type: 'Emergency Fund',
            amount: Math.min(surplus * 0.5, 10000),
            description: 'Build an emergency fund for unexpected expenses',
            priority: 'High'
          },
          {
            type: 'SIP in Mutual Funds',
            amount: surplus * 0.3,
            description: 'Start with low-risk equity mutual funds',
            priority: 'Medium'
          },
          {
            type: 'Skill Development',
            amount: surplus * 0.2,
            description: 'Invest in courses and certifications',
            priority: 'High'
          }
        ]
      } else {
        recommendations.investments = [
          {
            type: 'Emergency Fund',
            amount: Math.min(surplus * 0.3, 50000),
            description: '6 months of expenses in liquid funds',
            priority: 'High'
          },
          {
            type: 'Equity Mutual Funds',
            amount: surplus * 0.4,
            description: 'Long-term wealth creation through SIP',
            priority: 'High'
          },
          {
            type: 'PPF/ELSS',
            amount: surplus * 0.2,
            description: 'Tax-saving investments',
            priority: 'Medium'
          },
          {
            type: 'Fixed Deposits',
            amount: surplus * 0.1,
            description: 'Safe, guaranteed returns',
            priority: 'Low'
          }
        ]
      }
    }

    return recommendations
  }

  const handleStartOver = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('salaryData')
    localStorage.removeItem('expenseData')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="investment-result">
        <div className="container">
          <StepProgress currentStep={4} totalSteps={4} steps={steps} />
          <Loader text="Analyzing your financial data..." />
        </div>
      </div>
    )
  }

  return (
    <div className="investment-result">
      <div className="container">
        <StepProgress currentStep={4} totalSteps={4} steps={steps} />
        
        <div className="results-content">
          <h1 className="page-title">Your Investment Recommendations</h1>
          
          <div className="financial-overview">
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-label">Monthly Income</span>
                <span className="overview-value income">₹{results.income.toLocaleString()}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Monthly Expenses</span>
                <span className="overview-value expense">₹{results.expenses.toLocaleString()}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Monthly Surplus</span>
                <span className={`overview-value ${results.surplus > 0 ? 'surplus' : 'deficit'}`}>
                  ₹{results.surplus.toLocaleString()}
                </span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Savings Rate</span>
                <span className="overview-value rate">{results.savingsRate}%</span>
              </div>
            </div>
          </div>

          {results.surplus > 0 ? (
            <div className="recommendations-section">
              <h2 className="section-title">Recommended Investment Allocation</h2>
              <div className="recommendations-grid">
                {results.investments.map((investment, index) => (
                  <ResultCard
                    key={index}
                    title={investment.type}
                    amount={`₹${investment.amount.toLocaleString()}`}
                    description={investment.description}
                    type={investment.priority === 'High' ? 'success' : investment.priority === 'Medium' ? 'info' : 'warning'}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="deficit-section">
              <div className="deficit-card">
                <h2>⚠️ Budget Deficit Detected</h2>
                <p>Your expenses exceed your income by ₹{Math.abs(results.surplus).toLocaleString()}</p>
                <div className="deficit-suggestions">
                  <h3>Suggestions:</h3>
                  <ul>
                    <li>Review and reduce non-essential expenses</li>
                    <li>Look for additional income sources</li>
                    <li>Create a detailed budget plan</li>
                    <li>Consider financial counseling</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="result-actions">
            <Button onClick={handleStartOver} variant="outline">
              Start Over
            </Button>
            <Button onClick={() => navigate('/login')}>
              Save Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentResult