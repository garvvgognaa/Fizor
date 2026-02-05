import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import './ProfessionalStatus.css'

function ProfessionalStatus() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const statusOptions = [
        {
            id: 'student',
            title: 'Student',
            description: 'Currently pursuing education',
            icon: '🎓',
            color: '#2196f3'
        },
        {
            id: 'professional',
            title: 'Working Professional',
            description: 'Employed or self-employed',
            icon: '💼',
            color: '#4caf50'
        },
        {
            id: 'retired',
            title: 'Retired',
            description: 'Enjoying retirement',
            icon: '🏖️',
            color: '#ff9800'
        }
    ]

    const handleStatusSelect = async (status) => {
        setLoading(true)
        setError('')

        try {
            // Save professional status to backend
            await apiClient.patch('/profile/status', {
                professionalStatus: status.title
            })

            // Navigate to profile form
            navigate('/profile')
        } catch (err) {
            console.error('Error saving status:', err)
            setError(err.message || 'Failed to save your selection')
            setLoading(false)
        }
    }

    return (
        <div className="professional-status-page">
            <div className="container">
                <div className="status-content">
                    <div className="status-header">
                        <h1>What describes you best?</h1>
                        <p className="subtitle">This helps us personalize your financial recommendations</p>
                    </div>

                    {error && <div className="error-message-box">{error}</div>}

                    <div className="status-grid">
                        {statusOptions.map((status) => (
                            <button
                                key={status.id}
                                className="status-card"
                                style={{ '--card-color': status.color }}
                                onClick={() => handleStatusSelect(status)}
                                disabled={loading}
                            >
                                <div className="status-icon">{status.icon}</div>
                                <h3>{status.title}</h3>
                                <p>{status.description}</p>
                            </button>
                        ))}
                    </div>

                    <div className="navigation-buttons">
                        <button
                            className="back-button"
                            onClick={() => navigate('/reason')}
                            disabled={loading}
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfessionalStatus
