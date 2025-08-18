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
    // Проверяем наличие токена в cookies
    const token = request.cookies.get('telegram_token')?.value
    
    // Если нет токена, перенаправляем на главную
    if (!token) {
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
