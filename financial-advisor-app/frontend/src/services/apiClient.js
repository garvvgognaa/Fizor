import axios from 'axios'

let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fizor.onrender.com/api'

if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`
}
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')
                window.location.href = '/login'
            }

            // Return a formatted error message
            const errorMessage = data?.message || 'An error occurred'
            return Promise.reject(new Error(errorMessage))
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'))
        } else {
            // Something else happened
            return Promise.reject(new Error('An unexpected error occurred'))
        }
    }
)

export default apiClient
