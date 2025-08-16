'use client'

import { useCallback } from 'react'
import { useAuthContext } from '@/components/auth-provider'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  requireAuth?: boolean
}

interface ApiResponse<T = any> {
  data: T | null
  error: string | null
  loading: boolean
}

export function useApi() {
  const { getAuthHeaders } = useAuthContext()

  const request = useCallback(async <T = any>(
    url: string, 
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true
    } = options

    try {
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      }

      // Добавляем заголовки авторизации, если требуется
      if (requireAuth) {
        const authHeaders = getAuthHeaders()
        Object.assign(requestHeaders, authHeaders)
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      }

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body)
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, error: null, loading: false }
    } catch (error) {
      console.error('API request failed:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error', 
        loading: false 
      }
    }
  }, [getAuthHeaders])

  const get = useCallback(<T = any>(url: string, options?: Omit<ApiOptions, 'method'>) => {
    return request<T>(url, { ...options, method: 'GET' })
  }, [request])

  const post = useCallback(<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    return request<T>(url, { ...options, method: 'POST', body })
  }, [request])

  const put = useCallback(<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    return request<T>(url, { ...options, method: 'PUT', body })
  }, [request])

  const del = useCallback(<T = any>(url: string, options?: Omit<ApiOptions, 'method'>) => {
    return request<T>(url, { ...options, method: 'DELETE' })
  }, [request])

  const patch = useCallback(<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    return request<T>(url, { ...options, method: 'PATCH', body })
  }, [request])

  return {
    request,
    get,
    post,
    put,
    delete: del,
    patch
  }
}
