import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress/StepProgress'
import Button from '../../components/Button/Button'
import './UserTypeSelection.css'

function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  const steps = ['User Type', 'Salary', 'Expenses', 'Results']

  const handleNext = () => {
    if (selectedType) {
      localStorage.setItem('userType', selectedType)
      navigate('/salary')
    }
  }

  return (
    <div className="user-type-selection">
      <div className="container">
        <StepProgress currentStep={1} totalSteps={4} steps={steps} />
        
        <div className="selection-content">
          <h1 className="page-title">What describes you best?</h1>
          <p className="page-description">
            Choose your current status to get personalized financial recommendations
          </p>

          <div className="user-type-cards">
            <div 
              className={`user-type-card ${selectedType === 'student' ? 'selected' : ''}`}
              onClick={() => setSelectedType('student')}
            >
              <div className="card-icon">🎓</div>
              <h3>Student</h3>
              <p>Currently studying and looking to manage finances while in school</p>
              <ul>
                <li>Limited income sources</li>
                <li>Focus on budgeting</li>
                <li>Future planning</li>
              </ul>
            </div>

            <div 
              className={`user-type-card ${selectedType === 'professional' ? 'selected' : ''}`}
              onClick={() => setSelectedType('professional')}
            >
              <div className="card-icon">💼</div>
              <h3>Working Professional</h3>
              <p>Employed with regular income and looking to optimize investments</p>
              <ul>
                <li>Steady income</li>
                <li>Investment opportunities</li>
                <li>Retirement planning</li>
              </ul>
            </div>
          </div>

          <div className="selection-actions">
            <Button 
              onClick={handleNext} 
              disabled={!selectedType}
              size="large"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection