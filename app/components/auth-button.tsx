'use client'

import { useState } from 'react'
import { LogIn, LogOut, User, Loader2 } from 'lucide-react'
import { useAuthContext } from './auth-provider'
import { AuthModal } from './auth-modal'

interface AuthButtonProps {
  className?: string
  showUserInfo?: boolean
}

export function AuthButton({ className = '', showUserInfo = false }: AuthButtonProps) {
  const { user, isLoading, isAuthenticated, isTelegramApp, login, logout } = useAuthContext()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await login()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <button 
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Загрузка...</span>
      </button>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showUserInfo && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} />
            <span>{user.firstName}</span>
            {user.lastName && <span>{user.lastName}</span>}
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    )
  }

  if (isTelegramApp) {
    return (
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${className}`}
      >
        {isLoggingIn ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn size={16} />
        )}
        <span>Войти через Telegram</span>
      </button>
    )
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <LogIn size={16} />
          <span>Войти через Telegram</span>
        </button>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}
