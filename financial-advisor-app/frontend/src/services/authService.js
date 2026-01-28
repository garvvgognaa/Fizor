import apiClient from './apiClient'

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's password
     * @param {string} userData.role - User's role (student or professional)
     * @returns {Promise<Object>} User data and token
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData)

            const { user, token } = response.data.data

            // Store token and user data
            this.storeAuthData(token, user)

            return { user, token }
        } catch (error) {
            throw error
        }
    }

    /**
     * Login an existing user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<Object>} User data and token
     */
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', { email, password })

            const { user, token } = response.data.data

            // Store token and user data
            this.storeAuthData(token, user)

            return { user, token }
        } catch (error) {
            throw error
        }
    }

    /**
     * Store authentication data in localStorage
     * @param {string} token - JWT token
     * @param {Object} user - User data
     */
    storeAuthData(token, user) {
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))
    }

    /**
     * Get stored authentication token
     * @returns {string|null} JWT token
     */
    getToken() {
        return localStorage.getItem('authToken')
    }

    /**
     * Get stored user data
     * @returns {Object|null} User data
     */
    getUser() {
        const userData = localStorage.getItem('user')
        return userData ? JSON.parse(userData) : null
    }

    /**
     * Clear authentication data - logout
     */
    clearAuthData() {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
        localStorage.removeItem('salaryData')
        localStorage.removeItem('expenseData')
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken()
    }
}

export default new AuthService()
