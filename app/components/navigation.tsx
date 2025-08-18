'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Search, Bell } from 'lucide-react'
import { AuthButton } from './auth-button'
import { UserMenu } from './user-menu'
import { useAuthContext } from './auth-provider'
import { AuthSuccessNotification } from './auth-success-notification'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthSuccess, setShowAuthSuccess] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()

  const handleAuthSuccess = () => {
    // Показываем уведомление об успешной авторизации
    setShowAuthSuccess(true)
    // После успешной авторизации перенаправляем на страницу "Мои закупки"
    router.push('/my-purchases')
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      {showAuthSuccess && (
        <AuthSuccessNotification 
          message="Авторизация успешна! Вы перенаправлены на страницу 'Мои закупки'."
          onClose={() => setShowAuthSuccess(false)}
        />
      )}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-primary">
              НайдиЗакупку
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Главная
              </Link>
              <Link
                href="/tenders"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/tenders') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Тендеры
              </Link>
              {isAuthenticated && (
                <Link
                  href="/my-purchases"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-purchases') 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Мои закупки
                </Link>
              )}
              <Link
                href="/news"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/news') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Новости
              </Link>
              {isAuthenticated && (
                <Link
                  href="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Профиль
                </Link>
              )}
            </div>
          </div>

          {/* Right side icons and auth */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-primary p-2 rounded-md transition-colors">
              <Search size={20} />
            </button>
            <button className="text-muted-foreground hover:text-primary p-2 rounded-md transition-colors">
              <Bell size={20} />
            </button>
            
            {/* Auth components */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <AuthButton onAuthSuccess={handleAuthSuccess} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-primary p-2 rounded-md transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary bg-muted font-semibold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                href="/tenders"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/tenders') 
                    ? 'text-primary bg-muted font-semibold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Тендеры
              </Link>
              {isAuthenticated && (
                <Link
                  href="/my-purchases"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/my-purchases') 
                      ? 'text-primary bg-muted font-semibold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Мои закупки
                </Link>
              )}
              <Link
                href="/news"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/news') 
                    ? 'text-primary bg-muted font-semibold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Новости
              </Link>
              {isAuthenticated && (
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'text-primary bg-muted font-semibold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
              )}
            </div>
            {/* Mobile icons and auth */}
            <div className="px-2 pt-2 pb-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="text-muted-foreground hover:text-primary p-2 rounded-md transition-colors">
                    <Search size={20} />
                  </button>
                  <button className="text-muted-foreground hover:text-primary p-2 rounded-md transition-colors">
                    <Bell size={20} />
                  </button>
                </div>
                
                {/* Mobile auth */}
                <div className="flex items-center">
                  {isAuthenticated ? (
                    <UserMenu />
                  ) : (
                    <AuthButton onAuthSuccess={handleAuthSuccess} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  )
} 