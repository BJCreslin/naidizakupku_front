'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { UserProfile } from '@/components/user-profile'
import { AuthStatus } from '@/components/auth-status'
import { useAuthContext } from '@/components/auth-provider'
import { UserMenu } from '@/components/user-menu'
import { Shield, Settings, Activity, Bell } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuthContext()

  const ProfileContent = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Профиль пользователя
        </h1>
        <p className="text-gray-600">
          Управление настройками аккаунта и безопасностью
        </p>
      </div>

      {/* Auth Status */}
      <div className="mb-6">
        <AuthStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <UserProfile />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Быстрые действия
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                <Settings size={16} />
                <span>Настройки аккаунта</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                <Shield size={16} />
                <span>Безопасность</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                <Activity size={16} />
                <span>Активность</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                <Bell size={16} />
                <span>Уведомления</span>
              </button>
            </div>
          </div>

          {/* Auth Info */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Информация об авторизации
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID пользователя:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {user?.telegramId || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Тип авторизации:</span>
                <span className="text-gray-900">
                  JWT токен
                </span>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Статистика аккаунта
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Дней в системе:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Последний вход:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user ? new Date(user.lastActivityAt).toLocaleDateString('ru-RU') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
