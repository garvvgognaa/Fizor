import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import './ReasonSelection.css'

function ReasonSelection() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const reasons = [
        {
            id: 'wealth',
            title: 'Build Wealth for the Future',
            description: 'Create long-term wealth through smart investments',
            icon: '📈'
        },
        {
            id: 'retirement',
            title: 'Plan for Retirement',
            description: 'Secure your retirement with strategic planning',
            icon: '🏖️'
        },
        {
            id: 'goals',
            title: 'Save for Major Goals',
            description: 'House, education, car, or other life goals',
            icon: '🎯'
        },
        {
            id: 'optimize',
            title: 'Optimize My Finances',
            description: 'Get personalized advice to improve finances',
            icon: '💡'
        },
        {
            id: 'understand',
            title: 'Understand My Investments',
            description: 'Learn how to manage investments better',
            icon: '📊'
        }
    ]

    const handleReasonSelect = async (reason) => {
        setLoading(true)
        setError('')

        try {
            // Save the reason to backend
            await apiClient.patch('/profile/status', {
                usageReason: reason.title
            })

            // Navigate to professional status page
            navigate('/professional-status')
        } catch (err) {
            console.error('Error saving reason:', err)
            setError(err.message || 'Failed to save your selection')
            setLoading(false)
        }
    }

    return (
        <div className="reason-selection-page">
            <div className="container">
                <div className="reason-content">
                    <div className="reason-header">
                        <h1>Welcome, {user?.email?.split('@')[0] || 'there'}! 👋</h1>
                        <p className="subtitle">Let's personalize your experience. What brings you here today?</p>
                    </div>

                    {error && <div className="error-message-box">{error}</div>}

                    <div className="reasons-grid">
                        {reasons.map((reason) => (
                            <button
                                key={reason.id}
                                className="reason-card"
                                onClick={() => handleReasonSelect(reason)}
                                disabled={loading}
                            >
                                <div className="reason-icon">{reason.icon}</div>
                                <h3>{reason.title}</h3>
                                <p>{reason.description}</p>
                            </button>
                        ))}
                    </div>

                    <div className="skip-section">
                        <button
                            className="skip-button"
                            onClick={() => navigate('/professional-status')}
                            disabled={loading}
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReasonSelection
