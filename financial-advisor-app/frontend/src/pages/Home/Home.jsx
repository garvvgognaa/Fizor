import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button/Button'
import './Home.css'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Smart Financial Planning Made Simple
            </h1>
            <p className="hero-description">
              Get personalized investment recommendations based on your income,
              expenses, and financial goals. Our goal-based strategy engine creates
              a customized plan tailored to your risk appetite and investment horizon.
            </p>
            <div className="hero-actions">
              <Button size="large" onClick={handleGetStarted}>
                {user ? 'Create Your Plan' : 'Get Started'}
              </Button>
              {!user && (
                <Link to="/login">
                  <Button variant="outline" size="large">Login</Button>
                </Link>
              )}
              {user && (
                <Link to="/dashboard">
                  <Button variant="outline" size="large">View Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Why Choose Our Financial Advisor?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Goal-Based Planning</h3>
              <p>Select from 11 life goals including house, car, education, retirement, and wealth creation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Strategy</h3>
              <p>Get one of 6 investment strategies tailored to your risk profile and financial goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Smart Allocation</h3>
              <p>Automatic asset allocation across Large Cap, Mid Cap, Small Cap, and Debt funds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>10-Year Projection</h3>
              <p>See your expected portfolio value after 10 years with realistic return estimates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Emergency Fund Calc</h3>
              <p>Automatic calculation of 6-month emergency fund based on your expenses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your financial data is protected with JWT authentication and encrypted storage.</p>
            </div>
          </div>
        </div>

        <div className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Register / Login</h3>
              <p>Create your account to save and access your investment plan anytime.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Enter Financial Details</h3>
              <p>Provide your age, income, expenses, and investment amount.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Select Goals & Risk</h3>
              <p>Choose your financial goals, risk appetite, and investment horizon.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Get Your Plan</h3>
              <p>Receive a personalized investment strategy with detailed asset allocation.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Start Your Financial Journey?</h2>
          <p>Join thousands of users who have taken control of their financial future.</p>
          <Button size="large" onClick={handleGetStarted}>
            {user ? 'Create Investment Plan' : 'Sign Up Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home