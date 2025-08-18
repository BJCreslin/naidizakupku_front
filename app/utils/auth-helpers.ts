import { TelegramAuthData, AuthSession } from '@/types/auth'

// Ключи для localStorage
export const AUTH_KEYS = {
  SESSION_ID: 'telegram_session_id',
  TOKEN: 'telegram_token',
  USER_DATA: 'telegram_user_data',
} as const

// Функции для работы с localStorage и cookies
export const getStoredSessionId = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_KEYS.SESSION_ID)
}

export const setStoredSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEYS.SESSION_ID, sessionId)
  // Также сохраняем в cookies для middleware
  document.cookie = `telegram_session_id=${sessionId}; path=/; max-age=2592000; SameSite=Lax`
}

export const removeStoredSessionId = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEYS.SESSION_ID)
  // Удаляем из cookies
  document.cookie = 'telegram_session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_KEYS.TOKEN)
}

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEYS.TOKEN, token)
  // Также сохраняем в cookies для middleware
  document.cookie = `telegram_token=${token}; path=/; max-age=2592000; SameSite=Lax`
}

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEYS.TOKEN)
  // Удаляем из cookies
  document.cookie = 'telegram_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export const getStoredUserData = (): AuthSession | null => {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(AUTH_KEYS.USER_DATA)
  return data ? JSON.parse(data) : null
}

export const setStoredUserData = (userData: AuthSession): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData))
}

export const removeStoredUserData = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEYS.USER_DATA)
}

// Очистка всех данных авторизации
export const clearAuthData = (): void => {
  removeStoredSessionId()
  removeStoredToken()
  removeStoredUserData()
  // Очищаем все cookies авторизации
  document.cookie = 'telegram_session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'telegram_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

// Проверка, авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  const sessionId = getStoredSessionId()
  const token = getStoredToken()
  return !!(sessionId || token)
}

// Получение данных из Telegram Web App
export const getTelegramAuthData = (): TelegramAuthData | null => {
  if (typeof window === 'undefined') return null
  
  // Проверяем, запущено ли приложение в Telegram
  const tg = (window as any).Telegram?.WebApp
  if (!tg) return null

  // Получаем данные инициализации
  const initData = tg.initData
  if (!initData) return null

  // Парсим данные
  try {
    const urlParams = new URLSearchParams(initData)
    const authData: TelegramAuthData = {
      id: parseInt(urlParams.get('id') || '0'),
      first_name: urlParams.get('first_name') || '',
      last_name: urlParams.get('last_name') || undefined,
      username: urlParams.get('username') || undefined,
      photo_url: urlParams.get('photo_url') || undefined,
      auth_date: parseInt(urlParams.get('auth_date') || '0'),
      hash: urlParams.get('hash') || '',
      query_id: urlParams.get('query_id') || undefined,
      chat_type: urlParams.get('chat_type') || undefined,
      chat_instance: urlParams.get('chat_instance') || undefined,
      start_param: urlParams.get('start_param') || undefined,
      can_send_after: urlParams.get('can_send_after') ? parseInt(urlParams.get('can_send_after')!) : undefined,
      lang: urlParams.get('lang') || undefined,
    }

    // Проверяем обязательные поля
    if (!authData.id || !authData.first_name || !authData.hash) {
      return null
    }

    return authData
  } catch (error) {
    console.error('Error parsing Telegram auth data:', error)
    return null
  }
}

// Проверка, запущено ли приложение в Telegram
export const isTelegramWebApp = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!(window as any).Telegram?.WebApp
}

// Получение заголовков авторизации
export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken()
  const sessionId = getStoredSessionId()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (sessionId) {
    headers['X-Session-ID'] = sessionId
  }

  return headers
}
