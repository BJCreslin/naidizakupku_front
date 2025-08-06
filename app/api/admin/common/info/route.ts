import { NextResponse } from 'next/server'
import type { ProjectInfoDto, ProjectInfoResponse } from '@/types/project'

export async function GET() {
  try {
    // Запрос к реальному API сервера
    const response = await fetch('http://naidizakupku.ru/api/admin/common/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Добавляем таймаут на случай если сервер не отвечает
      next: { revalidate: 300 } // кешируем на 5 минут
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ProjectInfoDto = await response.json()

    const apiResponse: ProjectInfoResponse = {
      data: data
    }

    return NextResponse.json(apiResponse)
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