import { NextRequest, NextResponse } from 'next/server'
import { API_URLS } from '@/config/api'

export async function GET(request: NextRequest) {
  try {
    // Получаем информацию о боте с бэкенда
    const response = await fetch(`${API_URLS.AUTH_TELEGRAM_BOT_INFO}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching bot info:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Не удалось получить информацию о боте' 
      },
      { status: 500 }
    )
  }
}
