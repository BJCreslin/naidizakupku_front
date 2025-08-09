import { NextResponse } from 'next/server'
import type { ProjectInfoDto, ProjectInfoResponse } from '@/types/project'
import { API_URLS, API_CONFIG, buildApiUrl } from '@/config/api'
import { ApiHelpers } from '@/utils/api-helpers'

export async function GET() {
  try {
    console.log('Fetching project info from backend...')
    
    // Подготавливаем список кандидатов URL бэкенда (первый успешный используется)
    const candidateUrls: string[] = []
    const envBase = process.env.BACKEND_BASE_URL
    if (envBase) candidateUrls.push(`${envBase}/admin/common/info`)
    // Локальный бэкенд по умолчанию (согласно nginx-* конфигу)
    candidateUrls.push('http://127.0.0.1:9000/api/admin/common/info')
    // Публичный URL через nginx (на случай если прямой доступ недоступен)
    candidateUrls.push(buildApiUrl('/admin/common/info'))

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
        if (res.ok) {
          apiResponse = res
          break
        }
        lastError = new Error(`HTTP ${res.status}: ${await res.text()}`)
      } catch (e) {
        lastError = e
      }
    }

    if (apiResponse) {
      const data: ProjectInfoDto = await apiResponse.json()
      console.log('Backend project info received:', data)
      
      const response: ProjectInfoResponse = {
        data: data
      }

      return NextResponse.json(response)
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

    return NextResponse.json(fallbackResponse)
  }
} 