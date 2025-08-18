'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface AuthSuccessNotificationProps {
  message?: string
  onClose?: () => void
  autoHide?: boolean
  autoHideDelay?: number
}

export function AuthSuccessNotification({ 
  message = "Авторизация успешна! Добро пожаловать в систему.",
  onClose,
  autoHide = true,
  autoHideDelay = 5000
}: AuthSuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [autoHide, autoHideDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-green-400 hover:text-green-600 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
