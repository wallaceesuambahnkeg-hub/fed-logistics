import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User { id: number; name: string; email: string }
interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    try {
      const t = localStorage.getItem('fl_token')
      const u = localStorage.getItem('fl_user')
      if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    } catch {}
  }, [])

  const login = (t: string, u: User) => {
    setToken(t); setUser(u)
    localStorage.setItem('fl_token', t)
    localStorage.setItem('fl_user', JSON.stringify(u))
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('fl_token')
    localStorage.removeItem('fl_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
