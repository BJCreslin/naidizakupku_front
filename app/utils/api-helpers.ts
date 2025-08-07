import { API_CONFIG, buildApiUrl } from '@/config/api'

// Типы для API ответов
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}

// Утилиты для работы с API
export class ApiHelpers {
  /**
   * Выполняет GET запрос к API
   */
  static async get<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = buildApiUrl(endpoint)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return {
        data,
        success: true,
      }
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error)
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Выполняет POST запрос к API
   */
  static async post<T>(
    endpoint: string,
    body: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = buildApiUrl(endpoint)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return {
        data,
        success: true,
      }
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error)
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Проверяет доступность API
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(buildApiUrl('/health'), {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Создает объект с настройками кэширования
   */
  static getCacheOptions(revalidateSeconds = API_CONFIG.CACHE.REVALIDATE) {
    return {
      next: { revalidate: revalidateSeconds }
    }
  }

  /**
   * Форматирует ошибку API для пользователя
   */
  static formatErrorMessage(error: any): string {
    if (typeof error === 'string') return error
    if (error instanceof Error) return error.message
    if (error?.message) return error.message
    return 'Произошла неизвестная ошибка'
  }
}

// Экспортируем основные функции для удобства
export const apiGet = ApiHelpers.get
export const apiPost = ApiHelpers.post
export const checkApiHealth = ApiHelpers.checkHealth
export const formatApiError = ApiHelpers.formatErrorMessage
