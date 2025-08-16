'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthSession } from '@/types/auth'

interface AuthContextType {
  user: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  isTelegramApp: boolean
  login: () => Promise<boolean>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  checkSession: () => Promise<boolean>
  verifyToken: () => Promise<boolean>
  getAuthHeaders: () => Record<string, string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
