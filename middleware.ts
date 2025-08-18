import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Получаем путь запроса
  const path = request.nextUrl.pathname
  
  // Защищенные роуты, требующие авторизации
  const protectedRoutes = ['/tenders', '/my-purchases', '/profile']
  
  // Проверяем, является ли текущий путь защищенным
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  if (isProtectedRoute) {
    // Проверяем наличие токена или sessionId в cookies
    const token = request.cookies.get('telegram_token')?.value
    const sessionId = request.cookies.get('telegram_session_id')?.value
    
    // Если нет ни токена, ни sessionId, перенаправляем на главную
    if (!token && !sessionId) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tenders/:path*',
    '/my-purchases/:path*', 
    '/profile/:path*'
  ]
}
