import { NextResponse } from 'next/server'
import type { News, NewsResponse } from '@/types/news'
import { NewsType } from '@/types/news'
import { API_URLS, API_CONFIG, buildApiUrl } from '@/config/api'
import { ApiHelpers } from '@/utils/api-helpers'

export async function GET() {
  try {
    console.log('Fetching news from backend...')
    
    // Используем правильный URL к backend API
    const backendUrl = buildApiUrl('/news/top')
    console.log('Fetching from:', backendUrl)
    console.log('Full URL:', backendUrl)
    console.log('Expected URL: https://naidizakupku.ru/api/backend/news/top')
    
    const apiResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
      ...ApiHelpers.getCacheOptions()
    })

    if (!apiResponse.ok) {
      throw new Error(`HTTP ${apiResponse.status}: ${await apiResponse.text()}`)
    }

    const data: News[] = await apiResponse.json()
    console.log('Backend data received:', data.length, 'items')
    
    const response: NewsResponse = {
      data: data,
      total: data.length
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