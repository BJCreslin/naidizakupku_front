import { NextResponse } from 'next/server'
import type { ProjectInfoDto, ProjectInfoResponse } from '@/types/project'
import { API_URLS, API_CONFIG, buildApiUrl } from '@/config/api'
import { BACKEND_URLS } from '@/config/backend-urls'
import { ApiHelpers } from '@/utils/api-helpers'

// Отключаем кэширование для этого route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  // Проверяем параметр для принудительного обновления кэша
  const { searchParams } = new URL(request.url)
  const forceRefresh = searchParams.get('refresh') === 'true'
  
  if (forceRefresh) {
    console.log('Force refresh requested')
  }
  try {
    console.log('Fetching project info from backend...')
    
    // ВРЕМЕННО: Отключаем ВСЕ внешние вызовы для отладки
    const candidateUrls: string[] = []
    // const envBase = process.env.BACKEND_BASE_URL
    // if (envBase) candidateUrls.push(`${envBase}/admin/common/info`)
    // // Локальный бэкенд по умолчанию (согласно nginx-* конфигу)
    // candidateUrls.push('http://127.0.0.1:9000/api/admin/common/info')
    // // Внешний бэкенд API через nginx (правильный путь)
    // candidateUrls.push('https://naidizakupku.ru/api/backend/admin/common/info')

    let apiResponse: Response | null = null
    let lastError: unknown = null
    for (const url of candidateUrls) {
      try {
        console.log('Trying backend URL:', url)
        const res = await fetch(url, {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
          cache: 'no-store',
        })
        console.log('Response status:', res.status, 'for URL:', url)
        if (res.ok) {
          apiResponse = res
          console.log('Successfully got response from:', url)
          break
        }
        const errorText = await res.text()
        console.log('Error response:', errorText)
        lastError = new Error(`HTTP ${res.status}: ${errorText}`)
      } catch (e) {
        console.log('Fetch error for URL:', url, 'Error:', e)
        lastError = e
      }
    }

    if (apiResponse) {
      const backendData = await apiResponse.json()
      console.log('Backend project info received:', JSON.stringify(backendData, null, 2))
      
      // Если бэкенд уже вернул данные в правильном формате, используем их как есть
      // Если нет - оборачиваем в наш формат
      if (backendData && typeof backendData === 'object' && 'procurementsCount' in backendData) {
        // Прямые данные от бэкенда
        const response: ProjectInfoResponse = {
          data: backendData as ProjectInfoDto
        }
        return NextResponse.json(response)
      } else if (backendData && typeof backendData === 'object' && 'data' in backendData) {
        // Данные уже обернуты - возвращаем как есть
        return NextResponse.json(backendData)
      }
      
      // Fallback - оборачиваем сами
      const response: ProjectInfoResponse = {
        data: backendData as ProjectInfoDto
      }
      const nextResponse = NextResponse.json(response)
      nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      nextResponse.headers.set('Pragma', 'no-cache')
      nextResponse.headers.set('Expires', '0')
      return nextResponse
    }
    
    throw lastError || new Error('Failed to fetch project info')
  } catch (error) {
    console.error('Error fetching project info from backend, using fallback data:', error)
    
    // Fallback к моковым данным если внешний API недоступен
    console.log('Falling back to mock data')
    const fallbackData: ProjectInfoDto = {
      procurementsCount: 2450,
      membersCount: 890,
      budgetAmount: 156000000 // 156M рублей
    }

    const fallbackResponse: ProjectInfoResponse = {
      data: fallbackData
    }

    // Добавляем timestamp для отладки
    console.log('Fallback timestamp:', new Date().toISOString())

    console.log('Returning fallback response:', JSON.stringify(fallbackResponse, null, 2))
    const response = NextResponse.json(fallbackResponse)
    response.headers.set('X-Debug-Info', 'fallback-data-no-external-calls')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }
} 