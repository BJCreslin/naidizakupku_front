import { NextRequest, NextResponse } from 'next/server'
import { API_URLS } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'number' || code < 1 || code > 1000000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Код должен быть числом от 1 до 1000000' 
        },
        { status: 400 }
      )
    }

    // Отправляем код на бэкенд для валидации
    const response = await fetch(`${API_URLS.AUTH_TELEGRAM_BOT_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error during bot login:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при авторизации' 
      },
      { status: 500 }
    )
  }
}
