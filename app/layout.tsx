import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from './components/navigation'
import { Footer } from './components/footer'
import { AuthProvider } from './components/auth-provider'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'НайдиЗакупку - Платформа закупок',
  description: 'Информационная платформа для отслеживания и участия в государственных и коммерческих закупках',
  keywords: 'закупки, тендеры, государственные закупки, коммерческие закупки',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 