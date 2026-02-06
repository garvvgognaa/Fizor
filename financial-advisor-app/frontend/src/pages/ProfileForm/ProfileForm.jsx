import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import './ProfileForm.css'

function ProfileForm() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        age: '',
        monthlyIncome: '',
        monthlyExpenses: '',
        monthlyInvestment: '',
        profession: '',
        goals: [],
        riskAppetite: '',
        investmentHorizon: ''
    })

    const goalOptions = [
        'Buy a house',
        'Buy a car',
        'Higher education',
        'Child education',
        'Marriage',
        'Wealth creation',
        'Early retirement',
        'Business startup',
        'Travel / lifestyle',
        'Capital protection (low risk)',
        'High growth (high risk)'
    ]

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGoalToggle = (goal) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }))
    }

    const validateStep = () => {
        if (step === 1) {
            if (!formData.age || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.profession) {
                setError('Please fill in all fields')
                return false
            }
            if (formData.age < 18 || formData.age > 100) {
                setError('Age must be between 18 and 100')
                return false
            }
        } else if (step === 2) {
            if (!formData.monthlyInvestment || formData.monthlyInvestment <= 0) {
                setError('Please enter a valid investment amount')
                return false
            }
        } else if (step === 3) {
            if (formData.goals.length === 0) {
                setError('Please select at least one goal')
                return false
            }
            if (!formData.riskAppetite || !formData.investmentHorizon) {
                setError('Please select risk appetite and investment horizon')
                return false
            }
        }
        setError('')
        return true
    }

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        setError('')
        setStep(step - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateStep()) return

        setLoading(true)
        setError('')

        try {
            const response = await apiClient.post('/investment/calculate', formData)

            if (response.data.success) {
                navigate('/dashboard', { state: { recommendation: response.data.data } })
            }
        } catch (err) {
            setError(err.message || 'Failed to calculate investment plan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="profile-form-page">
            <div className="container">
                <div className="profile-form-container">
                    <div className="progress-bar">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>

                    <h1 className="form-title">
                        {step === 1 && 'Your Financial Profile'}
                        {step === 2 && 'Investment Details'}
                        {step === 3 && 'Goals & Risk Profile'}
                    </h1>

                    {error && <div className="error-message-box">{error}</div>}

                    <form onSubmit={handleSubmit} className="profile-form">
                        {step === 1 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Enter your age"
                                        min="18"
                                        max="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Profession</label>
                                    <select name="profession" value={formData.profession} onChange={handleInputChange}>
                                        <option value="">Select...</option>
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">Working Professional</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Monthly Income (₹)</label>
                                    <input
                                        type="number"
                                        name="monthlyIncome"
                                        value={formData.monthlyIncome}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 50000"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Monthly Expenses (₹)</label>
                                    <input
                                        type="number"
                                        name="monthlyExpenses"
                                        value={formData.monthlyExpenses}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 30000"
                                        min="0"
                                    />
                                </div>

                                <button type="button" onClick={handleNext} className="btn-primary">
                                    Next →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label>How much can you invest monthly? (₹)</label>
                                    <input
                                        type="number"
                                        name="monthlyInvestment"
                                        value={formData.monthlyInvestment}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 10000"
                                        min="0"
                                    />
                                    <small className="form-hint">
                                        Recommended: 20% of income (₹{Math.round(formData.monthlyIncome * 0.2 || 0)})
                                    </small>
                                </div>

                                <div className="button-group">
                                    <button type="button" onClick={handleBack} className="btn-secondary">
                                        ← Back
                                    </button>
                                    <button type="button" onClick={handleNext} className="btn-primary">
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label>What are your goals for the next 10 years? (Select all that apply)</label>
                                    <div className="goals-grid">
                                        {goalOptions.map(goal => (
                                            <div
                                                key={goal}
                                                className={`goal-card ${formData.goals.includes(goal) ? 'selected' : ''}`}
                                                onClick={() => handleGoalToggle(goal)}
                                            >
                                                {goal}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Risk Appetite</label>
                                    <select name="riskAppetite" value={formData.riskAppetite} onChange={handleInputChange}>
                                        <option value="">Select...</option>
                                        <option value="Low">Low - I prefer safety over returns</option>
                                        <option value="Medium">Medium - Balanced approach</option>
                                        <option value="High">High - I can handle market volatility</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Investment Horizon</label>
                                    <select name="investmentHorizon" value={formData.investmentHorizon} onChange={handleInputChange}>
                                        <option value="">Select...</option>
                                        <option value="Short (1–3 years)">Short (1–3 years)</option>
                                        <option value="Medium (3–7 years)">Medium (3–7 years)</option>
                                        <option value="Long (7–10+ years)">Long (7–10+ years)</option>
                                    </select>
                                </div>

                                <div className="button-group">
                                    <button type="button" onClick={handleBack} className="btn-secondary">
                                        ← Back
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Calculating...' : 'Get My Investment Plan'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileForm
