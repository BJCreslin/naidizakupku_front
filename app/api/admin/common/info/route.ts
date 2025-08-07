import { NextResponse } from 'next/server'
import type { ProjectInfoDto, ProjectInfoResponse } from '@/types/project'
import { API_URLS, API_CONFIG } from '@/config/api'
import { ApiHelpers } from '@/utils/api-helpers'

export async function GET() {
  try {
    // Используем утилиту для API запросов
    const apiResponse = await ApiHelpers.get<ProjectInfoDto>(
      API_CONFIG.ENDPOINTS.ADMIN.COMMON.INFO,
      ApiHelpers.getCacheOptions()
    )

    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to fetch project info')
    }

    const response: ProjectInfoResponse = {
      data: apiResponse.data
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching project info from external API:', error)
    
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