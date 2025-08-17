'use client'

import { useAuthContext } from './auth-provider'
import { Shield, User, AlertCircle, CheckCircle } from 'lucide-react'

export function AuthStatus() {
  const { user, isLoading, isAuthenticated, isTelegramApp } = useAuthContext()

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">Проверка авторизации...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <span className="text-green-800 font-medium">
              Авторизован как {user.firstName} {user.lastName}
            </span>
            {user.username && (
              <div className="text-green-700 text-sm">
                @{user.username} (ID: {user.telegramId})
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isTelegramApp) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <span className="text-yellow-800 font-medium">
              Приложение запущено в Telegram
            </span>
            <div className="text-yellow-700 text-sm">
              Нажмите &ldquo;Войти через Telegram&rdquo; для авторизации
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-gray-600" />
        <div>
          <span className="text-gray-800 font-medium">
            Не авторизован
          </span>
          <div className="text-gray-700 text-sm">
            Откройте приложение в Telegram для авторизации
          </div>
        </div>
      </div>
    </div>
  )
}
