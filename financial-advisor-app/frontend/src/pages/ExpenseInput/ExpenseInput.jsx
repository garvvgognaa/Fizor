import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress/StepProgress'
import Button from '../../components/Button/Button'
import './ExpenseInput.css'

function ExpenseInput() {
  const [formData, setFormData] = useState({
    housing: '',
    food: '',
    transportation: '',
    utilities: '',
    entertainment: '',
    healthcare: '',
    education: '',
    other: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const steps = ['User Type', 'Salary', 'Expenses', 'Results']
  const userType = localStorage.getItem('userType')

  const expenseCategories = [
    { key: 'housing', label: 'Housing/Rent', icon: '🏠' },
    { key: 'food', label: 'Food & Groceries', icon: '🍽️' },
    { key: 'transportation', label: 'Transportation', icon: '🚗' },
    { key: 'utilities', label: 'Utilities', icon: '💡' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { key: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { key: 'education', label: 'Education', icon: '📚' },
    { key: 'other', label: 'Other Expenses', icon: '💰' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    Object.keys(formData).forEach(key => {
      if (formData[key] && formData[key] < 0) {
        newErrors[key] = 'Expense cannot be negative'
      }
    })

    const totalExpenses = Object.values(formData).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
    if (totalExpenses === 0) {
      newErrors.general = 'Please enter at least one expense category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleNext = () => {
    if (validateForm()) {
      localStorage.setItem('expenseData', JSON.stringify(formData))
      navigate('/results')
    }
  }

  const handleBack = () => {
    navigate('/salary')
  }

  const totalExpenses = Object.values(formData).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)

  return (
    <div className="expense-input">
      <div className="container">
        <StepProgress currentStep={3} totalSteps={4} steps={steps} />
        
        <div className="form-content">
          <h1 className="page-title">Monthly Expenses</h1>
          <p className="page-description">
            Break down your monthly expenses to get accurate investment recommendations
          </p>

          <div className="expense-form">
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="expense-grid">
              {expenseCategories.map(category => (
                <div key={category.key} className="expense-item">
                  <label className="expense-label">
                    <span className="expense-icon">{category.icon}</span>
                    {category.label}
                  </label>
                  <input
                    type="number"
                    name={category.key}
                    value={formData[category.key]}
                    onChange={handleInputChange}
                    className={`form-input ${errors[category.key] ? 'error' : ''}`}
                    placeholder="₹0"
                  />
                  {errors[category.key] && (
                    <span className="error-message">{errors[category.key]}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="expense-summary">
              <div className="summary-item">
                <span>Total Monthly Expenses:</span>
                <span className="total-amount">₹{totalExpenses.toLocaleString()}</span>
              </div>
            </div>

            <div className="form-actions">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Get Recommendations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseInput