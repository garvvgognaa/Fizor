import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = authService.getUser()
    const token = authService.getToken()

    if (savedUser && token) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    if (token) {
      authService.storeAuthData(token, userData)
    }
  }

  const logout = () => {
    setUser(null)
    authService.clearAuthData()
  }

  const getToken = () => {
    return authService.getToken()
  }

  const value = {
    user,
    login,
    logout,
    getToken,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}