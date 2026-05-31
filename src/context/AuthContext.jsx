import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isLoggedIn = currentUser !== null

  const login = (user, token) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
    if (token) localStorage.setItem('authToken', token)
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
