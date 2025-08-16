'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut, Shield, Loader2 } from 'lucide-react'
import { useAuthContext } from './auth-provider'

interface UserMenuProps {
  className?: string
}

export function UserMenu({ className = '' }: UserMenuProps) {
  const { user, isLoading, isAuthenticated, logout, logoutAll } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false)
    }
  }

  const handleLogoutAll = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAll()
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false)
    }
  }

  if (isLoading || !isAuthenticated || !user) {
    return null
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-2">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.firstName}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={16} />
          )}
          <span className="hidden sm:inline">{user.firstName}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                {user.username && (
                  <div className="text-sm text-muted-foreground">
                    @{user.username}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  ID: {user.telegramId}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <Settings size={16} />
              <span>Настройки</span>
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <Shield size={16} />
              <span>Безопасность</span>
            </button>
          </div>

          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              <span>Выйти</span>
            </button>
            
            <button
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              <span>Выйти из всех устройств</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
