'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthSession, TelegramAuthData, ValidateTelegramResponse, SessionResponse, LogoutResponse, TokenVerifyResponse } from '@/types/auth'
import { API_URLS } from '@/config/api'
import { 
  getStoredSessionId, 
  setStoredSessionId, 
  removeStoredSessionId,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUserData,
  setStoredUserData,
  removeStoredUserData,
  clearAuthData,
  isAuthenticated,
  getTelegramAuthData,
  isTelegramWebApp,
  getAuthHeaders
} from '@/utils/auth-helpers'

interface UseAuthReturn {
  // Состояние
  user: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  isTelegramApp: boolean
  
  // Действия
  login: () => Promise<boolean>
  loginWithCode: (code: number) => Promise<boolean>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  checkSession: () => Promise<boolean>
  verifyToken: () => Promise<boolean>
  
  // Утилиты
  getAuthHeaders: () => Record<string, string>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTelegramApp, setIsTelegramApp] = useState(false)

  // Проверка сессии при загрузке
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const sessionId = getStoredSessionId()
      const token = getStoredToken()
      
      if (!sessionId && !token) {
        setIsLoading(false)
        return false
      }

      // Сначала проверяем токен, если есть
      if (token) {
        const isValid = await verifyToken()
        if (isValid) return true
      }

      // Затем проверяем сессию
      if (sessionId) {
        const response = await fetch(`${API_URLS.AUTH.TELEGRAM_SESSION}/${sessionId}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        })

        const data: SessionResponse = await response.json()
        
        if (data.success && data.session) {
          setUser(data.session)
          setStoredUserData(data.session)
          setIsAuthenticated(true)
          setIsLoading(false)
          return true
        }
      }

      // Если ничего не работает, очищаем данные
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Error checking session:', error)
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }
  }, [])

  // Проверка токена
  const verifyToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = getStoredToken()
      if (!token) return false

      const response = await fetch(API_URLS.AUTH.VERIFY_TOKEN, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data: TokenVerifyResponse = await response.json()
      
      if (data.success && data.valid && data.user) {
        // Создаем объект сессии из данных пользователя
        const session: AuthSession = {
          sessionId: 'token-based',
          telegramId: data.user.telegramId,
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          photoUrl: undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        }
        
        setUser(session)
        setStoredUserData(session)
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error verifying token:', error)
      return false
    }
  }, [])

  // Авторизация через Telegram Web App
  const login = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Проверяем, запущено ли приложение в Telegram
      const isTgApp = isTelegramWebApp()
      setIsTelegramApp(isTgApp)
      
      if (!isTgApp) {
        console.warn('Not running in Telegram Web App')
        setIsLoading(false)
        return false
      }

      // Получаем данные авторизации из Telegram
      const authData = getTelegramAuthData()
      if (!authData) {
        console.error('Failed to get Telegram auth data')
        setIsLoading(false)
        return false
      }

      // Отправляем данные на сервер для валидации
      const response = await fetch(API_URLS.AUTH.TELEGRAM_VALIDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      })

      const data: ValidateTelegramResponse = await response.json()
      
      if (data.success && data.session) {
        setUser(data.session)
        setStoredUserData(data.session)
        setIsAuthenticated(true)
        
        // Сохраняем sessionId и токен, если есть
        if (data.session.sessionId) {
          setStoredSessionId(data.session.sessionId)
        }
        if (data.token) {
          setStoredToken(data.token)
        }
        
        setIsLoading(false)
        return true
      } else {
        console.error('Login failed:', data.error || data.message)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error during login:', error)
      setIsLoading(false)
      return false
    }
  }, [])

  // Авторизация через код от Telegram бота
  const loginWithCode = useCallback(async (code: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Отправляем код на сервер для валидации
      const response = await fetch(API_URLS.AUTH.TELEGRAM_BOT_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      
      if (data.success && data.session) {
        setUser(data.session)
        setStoredUserData(data.session)
        setIsAuthenticated(true)
        
        // Сохраняем sessionId и токен, если есть
        if (data.session.sessionId) {
          setStoredSessionId(data.session.sessionId)
        }
        if (data.token) {
          setStoredToken(data.token)
        }
        
        setIsLoading(false)
        return true
      } else {
        console.error('Login with code failed:', data.error || data.message)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error during login with code:', error)
      setIsLoading(false)
      return false
    }
  }, [])

  // Выход из текущей сессии
  const logout = useCallback(async (): Promise<void> => {
    try {
      const sessionId = getStoredSessionId()
      
      if (sessionId) {
        await fetch(`${API_URLS.AUTH.TELEGRAM_LOGOUT}?sessionId=${sessionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  // Выход из всех сессий
  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      const userData = getStoredUserData()
      
      if (userData?.telegramId) {
        await fetch(`${API_URLS.AUTH.TELEGRAM_LOGOUT_ALL}?telegramId=${userData.telegramId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
      }
    } catch (error) {
      console.error('Error during logout all:', error)
    } finally {
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  // Инициализация при загрузке
  useEffect(() => {
    const initAuth = async () => {
      // Проверяем, запущено ли приложение в Telegram
      const isTgApp = isTelegramWebApp()
      setIsTelegramApp(isTgApp)
      
      // Если запущено в Telegram, пытаемся авторизоваться
      if (isTgApp) {
        const success = await login()
        if (!success) {
          setIsLoading(false)
        }
      } else {
        // Если не в Telegram, проверяем существующую сессию
        await checkSession()
      }
    }

    initAuth()
  }, [login, checkSession, verifyToken])

  return {
    user,
    isLoading,
    isAuthenticated,
    isTelegramApp,
    login,
    loginWithCode,
    logout,
    logoutAll,
    checkSession,
    verifyToken,
    getAuthHeaders,
  }
}
