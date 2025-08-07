import { NextResponse } from 'next/server'
import type { News, NewsResponse } from '@/types/news'
import { NewsType } from '@/types/news'
import { API_URLS, API_CONFIG } from '@/config/api'
import { ApiHelpers } from '@/utils/api-helpers'

export async function GET() {
  try {
    console.log('Fetching news from backend...')
    
    // Используем утилиту для API запросов
    const apiResponse = await ApiHelpers.get<News[]>(
      API_CONFIG.ENDPOINTS.NEWS.TOP,
      ApiHelpers.getCacheOptions()
    )

    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to fetch news')
    }

    console.log('Backend data received:', apiResponse.data.length, 'items')
    
    const response: NewsResponse = {
      data: apiResponse.data,
      total: apiResponse.data.length
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news from backend, using fallback data:', error)
    
    // Fallback данные на случай недоступности API
    const fallbackNews: News[] = [
      {
        id: 1,
        title: "Изменения в федеральном законе о контрактной системе",
        url: "https://zakupki.gov.ru/epz/news/1",
        publicationDate: "2024-01-15T10:30:00",
        content: "Внесены важные изменения в порядок проведения государственных закупок...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-15T10:30:00",
        updatedAt: "2024-01-15T10:30:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 2,
        title: "Новые требования к поставщикам в 2024 году",
        url: "https://zakupki.gov.ru/epz/news/2",
        publicationDate: "2024-01-14T14:20:00",
        content: "С 1 февраля вступают в силу обновленные требования к участникам закупок...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-14T14:20:00",
        updatedAt: "2024-01-14T14:20:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 3,
        title: "Планируемые технические работы на портале",
        url: "https://zakupki.gov.ru/epz/news/3",
        publicationDate: "2024-01-13T16:45:00",
        content: "Уведомляем о плановых технических работах на Единой информационной системе...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-13T16:45:00",
        updatedAt: "2024-01-13T16:45:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      }
    ]

    const response: NewsResponse = {
      data: fallbackNews,
      total: fallbackNews.length
    }

    return NextResponse.json(response)
  }
} 