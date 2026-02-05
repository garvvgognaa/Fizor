import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import './Dashboard.css'

function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [recommendation, setRecommendation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        // If coming from profile form with state
        if (location.state?.recommendation) {
            setRecommendation(location.state.recommendation)
            setLoading(false)
        } else {
            // Fetch saved recommendation from backend
            fetchRecommendation()
        }
    }, [user, navigate, location])

    const fetchRecommendation = async () => {
        try {
            const response = await apiClient.get('/investment/recommendation')
            if (response.data.success) {
                setRecommendation(response.data.data)
            }
        } catch (err) {
            if (err.message.includes('No previous recommendations')) {
                navigate('/profile')
            } else {
                setError(err.message || 'Failed to load recommendation')
            }
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatGoals = (goalsData) => {
        if (Array.isArray(goalsData)) {
            return goalsData
        }
        // If coming from database, it might be JSON string
        if (typeof goalsData === 'string') {
            try {
                return JSON.parse(goalsData)
            } catch {
                return []
            }
        }
        return []
    }

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your investment plan...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => navigate('/profile')} className="btn-primary">
                        Create Profile
                    </button>
                </div>
            </div>
        )
    }

    if (!recommendation) {
        return (
            <div className="dashboard-page">
                <div className="error-container">
                    <p>No recommendation found</p>
                    <button onClick={() => navigate('/profile')} className="btn-primary">
                        Create Profile
                    </button>
                </div>
            </div>
        )
    }

    const alloc = recommendation.allocationPercentages || {}
    const sip = recommendation.monthlySIPSplit || {}
    const goals = formatGoals(recommendation.goals || recommendation.goalWiseSplit)

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Your Personalized Investment Plan</h1>
                    <div className="strategy-badge">{recommendation.strategyType}</div>
                </div>

                <div className="dashboard-grid">
                    {/* Summary Card */}
                    <div className="dashboard-card summary-card">
                        <h2>Investment Summary</h2>
                        <div className="summary-item">
                            <span className="summary-label">Monthly SIP</span>
                            <span className="summary-value">{formatCurrency(recommendation.monthlySIPAmount || 0)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Expected 10-Year Value</span>
                            <span className="summary-value highlight">{formatCurrency(recommendation.expectedTenYearValue || 0)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Emergency Fund Required</span>
                            <span className="summary-value">{formatCurrency(recommendation.emergencyFundAmount || 0)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Risk Level</span>
                            <span className="summary-value">{recommendation.riskLevel || '-'}</span>
                        </div>
                    </div>

                    {/* Allocation Chart */}
                    <div className="dashboard-card">
                        <h2>Asset Allocation</h2>
                        <div className="allocation-bars">
                            <div className="allocation-item">
                                <div className="allocation-header">
                                    <span>Equity</span>
                                    <span className="allocation-percent">{alloc.equity?.toFixed(1) || 0}%</span>
                                </div>
                                <div className="allocation-bar">
                                    <div className="allocation-fill equity" style={{ width: `${alloc.equity || 0}%` }}></div>
                                </div>
                            </div>

                            <div className="allocation-item">
                                <div className="allocation-header">
                                    <span>Debt</span>
                                    <span className="allocation-percent">{alloc.debt?.toFixed(1) || 0}%</span>
                                </div>
                                <div className="allocation-bar">
                                    <div className="allocation-fill debt" style={{ width: `${alloc.debt || 0}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="subsection-title">Equity Breakdown</h3>
                        <div className="breakdown-grid">
                            <div className="breakdown-item">
                                <span>Large Cap</span>
                                <strong>{formatCurrency(sip.largeCap || 0)}</strong>
                                <small>{alloc.largeCap?.toFixed(1) || 0}%</small>
                            </div>
                            <div className="breakdown-item">
                                <span>Mid Cap</span>
                                <strong>{formatCurrency(sip.midCap || 0)}</strong>
                                <small>{alloc.midCap?.toFixed(1) || 0}%</small>
                            </div>
                            <div className="breakdown-item">
                                <span>Small Cap</span>
                                <strong>{formatCurrency(sip.smallCap || 0)}</strong>
                                <small>{alloc.smallCap?.toFixed(1) || 0}%</small>
                            </div>
                            <div className="breakdown-item">
                                <span>Debt</span>
                                <strong>{formatCurrency(sip.debt || 0)}</strong>
                                <small>{alloc.debt?.toFixed(1) || 0}%</small>
                            </div>
                        </div>
                    </div>

                    {/* Goals */}
                    <div className="dashboard-card">
                        <h2>Your Selected Goals</h2>
                        <div className="goals-list">
                            {Array.isArray(goals) && goals.length > 0 ? (
                                goals.map((goal, index) => (
                                    <div key={index} className="goal-item">
                                        ✓ {goal}
                                    </div>
                                ))
                            ) : (
                                <p>No goals selected</p>
                            )}
                        </div>
                    </div>

                    {/* Expected Returns */}
                    <div className="dashboard-card">
                        <h2>Expected Returns</h2>
                        <div className="returns-grid">
                            <div className="return-item">
                                <span>Large Cap</span>
                                <span className="return-value">{recommendation.expectedReturns?.largeCap || '-'}</span>
                            </div>
                            <div className="return-item">
                                <span>Mid Cap</span>
                                <span className="return-value">{recommendation.expectedReturns?.midCap || '-'}</span>
                            </div>
                            <div className="return-item">
                                <span>Small Cap</span>
                                <span className="return-value">{recommendation.expectedReturns?.smallCap || '-'}</span>
                            </div>
                            <div className="return-item">
                                <span>Debt</span>
                                <span className="return-value">{recommendation.expectedReturns?.debt || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Budget Guidance */}
                    {recommendation.budgetGuidance && (
                        <div className="dashboard-card">
                            <h2>50-30-20 Budget Guidance</h2>
                            <div className="budget-grid">
                                <div className="budget-item needs">
                                    <span>Needs (50%)</span>
                                    <strong>{formatCurrency(recommendation.budgetGuidance.needs)}</strong>
                                </div>
                                <div className="budget-item wants">
                                    <span>Wants (30%)</span>
                                    <strong>{formatCurrency(recommendation.budgetGuidance.wants)}</strong>
                                </div>
                                <div className="budget-item investments">
                                    <span>Investments (20%)</span>
                                    <strong>{formatCurrency(recommendation.budgetGuidance.investments)}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Financial Breakdown Card */}
                    <div className="dashboard-card financial-breakdown-card">
                        <h2>Your Financial Overview</h2>
                        <div className="financial-items">
                            <div className="financial-item income">
                                <span className="financial-label">Monthly Income</span>
                                <span className="financial-value">{formatCurrency(recommendation.monthlyIncome || 0)}</span>
                            </div>
                            <div className="financial-item expenses">
                                <span className="financial-label">Monthly Expenses</span>
                                <span className="financial-value">{formatCurrency(recommendation.monthlyExpenses || 0)}</span>
                            </div>
                            <div className="financial-item investment">
                                <span className="financial-label">Monthly Investment</span>
                                <span className="financial-value">{formatCurrency(recommendation.monthlySIPAmount || 0)}</span>
                            </div>
                            <div className="financial-item savings">
                                <span className="financial-label">Monthly Savings</span>
                                <span className="financial-value highlight">{formatCurrency(recommendation.monthlySavings || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Optimization Suggestions Card */}
                    {recommendation.optimizationSuggestions && recommendation.optimizationSuggestions.length > 0 && (
                        <div className="dashboard-card optimization-card">
                            <h2>💡 Personalized Suggestions</h2>
                            <div className="suggestions-list">
                                {recommendation.optimizationSuggestions.map((suggestion, index) => (
                                    <div key={index} className={`suggestion-item priority-${suggestion.priority}`}>
                                        <div className="suggestion-header">
                                            <h3>{suggestion.title}</h3>
                                            {suggestion.priority === 'high' && <span className="priority-badge high">High Priority</span>}
                                            {suggestion.priority === 'medium' && <span className="priority-badge medium">Consider</span>}
                                        </div>
                                        <p>{suggestion.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="dashboard-actions">
                    <button onClick={() => navigate('/profile')} className="btn-secondary">
                        Update Profile
                    </button>
                    <button onClick={() => window.print()} className="btn-primary">
                        Print Plan
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
