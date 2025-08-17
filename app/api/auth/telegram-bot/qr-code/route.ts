import { NextRequest, NextResponse } from 'next/server'
import { API_URLS } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { botUrl } = body

    if (!botUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL бота обязателен' 
        },
        { status: 400 }
      )
    }

    // Генерируем QR код на бэкенде
    const response = await fetch(`${API_URLS.AUTH_TELEGRAM_BOT_QR_CODE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botUrl }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating QR code:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Не удалось сгенерировать QR код' 
      },
      { status: 500 }
    )
  }
}
