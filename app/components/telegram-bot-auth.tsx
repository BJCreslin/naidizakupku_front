'use client'

import { useState, useEffect } from 'react'
import { QrCode, MessageSquare, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuthContext } from './auth-provider'

interface TelegramBotAuthProps {
  className?: string
}

interface BotInfo {
  botUsername: string
  botUrl: string
  qrCodeUrl?: string
}

interface AuthCodeResponse {
  success: boolean
  code?: number
  error?: string
}

export function TelegramBotAuth({ className = '' }: TelegramBotAuthProps) {
  const { loginWithCode } = useAuthContext()
  const [step, setStep] = useState<'loading' | 'bot-info' | 'code-input' | 'success' | 'error'>('loading')
  const [isVerifying, setIsVerifying] = useState(false)
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  // Получение информации о боте
  const fetchBotInfo = async () => {
    try {
      setStep('loading')
      const response = await fetch('/api/auth/telegram-bot/info')
      const data = await response.json()
      
      if (data.success) {
        setBotInfo(data.botInfo)
        setStep('bot-info')
      } else {
        setError(data.error || 'Не удалось получить информацию о боте')
        setStep('error')
      }
    } catch (error) {
      setError('Ошибка подключения к серверу')
      setStep('error')
    }
  }

  // Генерация QR кода
  const generateQrCode = async () => {
    if (!botInfo) return
    
    try {
      const response = await fetch('/api/auth/telegram-bot/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botUrl: botInfo.botUrl })
      })
      
      const data = await response.json()
      if (data.success && data.qrCodeUrl) {
        setBotInfo(prev => prev ? { ...prev, qrCodeUrl: data.qrCodeUrl } : null)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Проверка кода
  const verifyCode = async () => {
    if (!code.trim()) {
      setError('Введите код')
      return
    }

    const codeNumber = parseInt(code)
    if (isNaN(codeNumber) || codeNumber < 1 || codeNumber > 1000000) {
      setError('Код должен быть числом от 1 до 1000000')
      return
    }

    try {
      setIsVerifying(true)
      setError('')
      
      const success = await loginWithCode(codeNumber)
      if (success) {
        setStep('success')
      } else {
        setError('Неверный код или время истекло')
      }
    } catch (error) {
      setError('Ошибка при проверке кода')
    } finally {
      setIsVerifying(false)
    }
  }

  // Обработка ввода кода
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Только цифры
    if (value.length <= 7) { // Максимум 7 цифр для числа до 1000000
      setCode(value)
    }
  }

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyCode()
  }

  // Сброс состояния
  const resetAuth = () => {
    setStep('loading')
    setCode('')
    setError('')
    setBotInfo(null)
    setIsVerifying(false)
    fetchBotInfo()
  }

  // Запуск таймера для кода
  useEffect(() => {
    if (step === 'code-input' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, step])

  // Инициализация при загрузке
  useEffect(() => {
    fetchBotInfo()
  }, [])

  if (step === 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 space-y-4 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 space-y-4 ${className}`}>
        <XCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive text-center">{error}</p>
        <button
          onClick={resetAuth}
          className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 space-y-4 ${className}`}>
        <CheckCircle className="h-8 w-8 text-green-500" />
        <p className="text-sm text-green-600 font-medium">Авторизация успешна!</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      {/* Информация о боте */}
      {step === 'bot-info' && botInfo && (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Авторизация через Telegram бота</h3>
            <p className="text-sm text-muted-foreground">
              Перейдите в бота и получите код командой /code
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* QR код */}
            {botInfo.qrCodeUrl && (
              <div className="flex flex-col items-center space-y-2">
                <div className="border rounded-lg p-2 bg-white">
                  <img 
                    src={botInfo.qrCodeUrl} 
                    alt="QR код для Telegram бота"
                    className="w-32 h-32"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Отсканируйте QR код</p>
              </div>
            )}

            {/* Ссылка на бота */}
            <div className="flex flex-col items-center space-y-2">
              <a
                href={botInfo.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MessageSquare size={16} />
                <span>Открыть бота</span>
              </a>
              <p className="text-xs text-muted-foreground">Или нажмите на ссылку</p>
            </div>
          </div>

          {/* Кнопка генерации QR кода */}
          {!botInfo.qrCodeUrl && (
            <div className="text-center">
              <button
                onClick={generateQrCode}
                className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <QrCode size={16} />
                <span>Показать QR код</span>
              </button>
            </div>
          )}

          {/* Переход к вводу кода */}
          <div className="text-center pt-4 border-t">
            <button
              onClick={() => setStep('code-input')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              У меня есть код
            </button>
          </div>
        </div>
      )}

      {/* Ввод кода */}
      {step === 'code-input' && (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Введите код из бота</h3>
            <p className="text-sm text-muted-foreground">
              Код действует ограниченное время
            </p>
            {countdown > 0 && (
              <p className="text-xs text-orange-600">
                Осталось времени: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="Введите код (например: 123456)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={7}
                disabled={isVerifying}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isVerifying || !code.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>{isVerifying ? 'Проверка...' : 'Войти'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('bot-info')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Назад
              </button>
            </div>
          </form>
        </div>
      )}


    </div>
  )
}
