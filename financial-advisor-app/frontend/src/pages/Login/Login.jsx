import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import Button from '../../components/Button/Button'
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Call backend API
      const { user, token } = await authService.login(formData.email, formData.password)

      // Update auth context with user data and token
      login(user, token)

      // Smart navigation based on onboarding status
      // If user hasn't selected reason, go to reason page
      if (!user.usageReason && !user.professionalStatus) {
        navigate('/reason')
      }
      // If user has reason but not professional status, go to professional status
      else if (user.usageReason && !user.professionalStatus) {
        navigate('/professional-status')
      }
      // If user has both but no profile data, go to profile form
      else if (!user.monthlyIncome || !user.goals) {
        navigate('/profile')
      }
      // Otherwise, user has completed onboarding, go to dashboard
      else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: error.message || 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-content">
          <div className="login-form-container">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-description">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-message general-error">{errors.general}</div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="login-button"
              >
                Sign In
              </Button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login