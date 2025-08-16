'use client'

import { useAuthContext } from './auth-provider'
import { User, Calendar, Shield, Settings, Edit } from 'lucide-react'

interface UserProfileProps {
  className?: string
  showActions?: boolean
}

export function UserProfile({ className = '', showActions = true }: UserProfileProps) {
  const { user, isAuthenticated } = useAuthContext()

  if (!isAuthenticated || !user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
          )}
          {user.isActive && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h2>
          {user.username && (
            <p className="text-muted-foreground">@{user.username}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Telegram ID: {user.telegramId}
          </p>
        </div>

        {showActions && (
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Edit size={16} />
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-gray-900">Дата регистрации</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Shield size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-gray-900">Последняя активность</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(user.lastActivityAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-muted-foreground">
          {user.isActive ? 'Активен' : 'Неактивен'}
        </span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-border">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
            <Settings size={16} />
            <span>Настройки</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
            <Shield size={16} />
            <span>Безопасность</span>
          </button>
        </div>
      )}
    </div>
  )
}
