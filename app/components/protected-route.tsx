'use client'

import { ReactNode } from 'react'
import { useAuthContext } from './auth-provider'
import { AuthButton } from './auth-button'
import { Shield, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requireTelegram?: boolean
  customMessage?: string
  onAuthSuccess?: () => void
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireTelegram = false,
  customMessage,
  onAuthSuccess
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isTelegramApp } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <Lock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Требуется авторизация
            </h2>
            <p className="text-gray-600 mb-4">
              {customMessage || 'Для доступа к этой странице необходимо войти в систему через Telegram.'}
            </p>
            <AuthButton className="mx-auto" onAuthSuccess={onAuthSuccess} />
          </div>
        </div>
      </div>
    )
  }

  if (requireTelegram && !isTelegramApp) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Требуется Telegram
            </h2>
            <p className="text-gray-600 mb-4">
              Эта функция доступна только при использовании приложения в Telegram.
            </p>
            <div className="text-sm text-blue-700">
              Откройте приложение в Telegram для полного доступа
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
