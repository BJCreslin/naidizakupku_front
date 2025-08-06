import { NextResponse } from 'next/server'
import type { News, NewsResponse } from '@/types/news'
import { NewsType } from '@/types/news'

export async function GET() {
  try {
    // Запрос к бэкенду за актуальными новостями
    const backendResponse = await fetch('https://naidizakupku.ru/api/news/top', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      next: { 
        revalidate: 300 // Кэшируем на 5 минут
      }
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend API error: ${backendResponse.status}`)
    }

    const backendData: News[] = await backendResponse.json()
    
    const response: NewsResponse = {
      data: backendData,
      total: backendData.length
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
} 