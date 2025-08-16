'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { useState } from 'react'

interface AuthErrorProps {
  error: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function AuthError({ error, onRetry, onDismiss, className = '' }: AuthErrorProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const handleRetry = () => {
    onRetry?.()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Ошибка авторизации
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error}
          </p>
          
          <div className="flex items-center gap-3">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                <RefreshCw size={14} />
                Повторить
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
