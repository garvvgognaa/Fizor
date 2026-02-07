import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress/StepProgress'
import Button from '../../components/Button/Button'
import './SalaryInput.css'

function SalaryInput() {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    additionalIncome: '',
    incomeSource: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const steps = ['User Type', 'Salary', 'Expenses', 'Results']
  const userType = localStorage.getItem('userType')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = 'Please enter a valid monthly income'
    }
    
    if (formData.additionalIncome && formData.additionalIncome < 0) {
      newErrors.additionalIncome = 'Additional income cannot be negative'
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
      localStorage.setItem('salaryData', JSON.stringify(formData))
      navigate('/expenses')
    }
  }

  const handleBack = () => {
    navigate('/user-type')
  }

  return (
    <div className="salary-input">
      <div className="container">
        <StepProgress currentStep={2} totalSteps={4} steps={steps} />
        
        <div className="form-content">
          <h1 className="page-title">
            {userType === 'student' ? 'Your Income Details' : 'Your Salary Information'}
          </h1>
          <p className="page-description">
            Help us understand your financial situation to provide better recommendations
          </p>

          <div className="salary-form">
            <div className="form-group">
              <label className="form-label">
                {userType === 'student' ? 'Monthly Income (₹)' : 'Monthly Salary (₹)'}
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className={`form-input ${errors.monthlyIncome ? 'error' : ''}`}
                placeholder="Enter your monthly income"
              />
              {errors.monthlyIncome && (
                <span className="error-message">{errors.monthlyIncome}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Additional Income (₹)</label>
              <input
                type="number"
                name="additionalIncome"
                value={formData.additionalIncome}
                onChange={handleInputChange}
                className={`form-input ${errors.additionalIncome ? 'error' : ''}`}
                placeholder="Freelancing, part-time jobs, etc."
              />
              {errors.additionalIncome && (
                <span className="error-message">{errors.additionalIncome}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Primary Income Source</label>
              <select
                name="incomeSource"
                value={formData.incomeSource}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select income source</option>
                {userType === 'student' ? (
                  <>
                    <option value="part-time-job">Part-time Job</option>
                    <option value="internship">Internship</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="family-support">Family Support</option>
                    <option value="scholarship">Scholarship</option>
                  </>
                ) : (
                  <>
                    <option value="full-time-job">Full-time Job</option>
                    <option value="business">Business</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="consulting">Consulting</option>
                    <option value="multiple-sources">Multiple Sources</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-actions">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalaryInput