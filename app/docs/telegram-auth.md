# Авторизация через Telegram

## Обзор

Система авторизации через Telegram Web App позволяет пользователям входить в приложение, используя свои Telegram аккаунты. Это обеспечивает безопасную и удобную аутентификацию без необходимости создания отдельных учетных записей.

## Архитектура

### Компоненты

1. **AuthProvider** (`app/components/auth-provider.tsx`) - Контекст провайдер для управления состоянием авторизации
2. **useAuth** (`app/hooks/use-auth.ts`) - Основной хук для работы с авторизацией
3. **AuthButton** (`app/components/auth-button.tsx`) - Кнопка входа/выхода
4. **UserMenu** (`app/components/user-menu.tsx`) - Меню пользователя с расширенными опциями
5. **ProtectedRoute** (`app/components/protected-route.tsx`) - Компонент для защиты маршрутов
6. **AuthStatus** (`app/components/auth-status.tsx`) - Отображение статуса авторизации

### Типы данных

Все типы определены в `app/types/auth.ts`:

- `TelegramAuthData` - Данные авторизации от Telegram
- `AuthSession` - Сессия пользователя
- `AuthResponse` - Ответы API авторизации

### Утилиты

- `app/utils/auth-helpers.ts` - Функции для работы с localStorage и Telegram Web App
- `app/hooks/use-api.ts` - Хук для API запросов с авторизацией

## API Endpoints

### 1. POST /api/auth/telegram/validate
Валидация данных от Telegram Web App

**Запрос:**
```typescript
{
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
  // ... другие поля Telegram
}
```

**Ответ:**
```typescript
{
  success: boolean
  session?: AuthSession
  token?: string
  message?: string
  error?: string
}
```

### 2. GET /api/auth/telegram/session/{sessionId}
Проверка активной сессии

**Ответ:**
```typescript
{
  success: boolean
  session?: AuthSession
  message?: string
  error?: string
}
```

### 3. DELETE /api/auth/telegram/logout?sessionId={sessionId}
Выход из текущей сессии

**Ответ:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

### 4. DELETE /api/auth/telegram/logout/all?telegramId={telegramId}
Выход из всех сессий пользователя

**Ответ:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

### 5. GET /api/v1/verify-token
Проверка JWT токена

**Заголовки:**
```
Authorization: Bearer {token}
```

**Ответ:**
```typescript
{
  success: boolean
  valid: boolean
  user?: {
    telegramId: number
    username?: string
    firstName: string
    lastName?: string
  }
  message?: string
  error?: string
}
```

## Использование

### Базовое использование

```tsx
import { useAuthContext } from '@/components/auth-provider'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext()

  if (!isAuthenticated) {
    return <button onClick={login}>Войти через Telegram</button>
  }

  return (
    <div>
      <p>Привет, {user?.firstName}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  )
}
```

### Защищенные маршруты

```tsx
import { ProtectedRoute } from '@/components/protected-route'

function MyPage() {
  return (
    <ProtectedRoute>
      <div>Защищенный контент</div>
    </ProtectedRoute>
  )
}
```

### API запросы с авторизацией

```tsx
import { useApi } from '@/hooks/use-api'

function MyComponent() {
  const { get, post } = useApi()

  const fetchData = async () => {
    const response = await get('/api/protected-endpoint')
    if (response.data) {
      console.log(response.data)
    }
  }

  const sendData = async () => {
    const response = await post('/api/protected-endpoint', { data: 'value' })
    if (response.data) {
      console.log('Success:', response.data)
    }
  }
}
```

## Хранение данных

### localStorage ключи

- `telegram_session_id` - ID сессии
- `telegram_token` - JWT токен
- `telegram_user_data` - Данные пользователя

### Автоматическая очистка

Данные автоматически очищаются при:
- Выходе из системы
- Истечении сессии
- Ошибках авторизации

## Безопасность

### Валидация данных Telegram

1. Проверка обязательных полей (id, first_name, hash)
2. Валидация hash на сервере
3. Проверка времени auth_date

### Защита маршрутов

- Автоматическая проверка авторизации
- Редирект на страницу входа при необходимости
- Поддержка fallback компонентов

### Обработка ошибок

- Автоматическая очистка данных при ошибках
- Пользовательские сообщения об ошибках
- Возможность повтора операций

## Интеграция с Telegram Web App

### Определение контекста

```typescript
import { isTelegramWebApp } from '@/utils/auth-helpers'

if (isTelegramWebApp()) {
  // Приложение запущено в Telegram
}
```

### Получение данных авторизации

```typescript
import { getTelegramAuthData } from '@/utils/auth-helpers'

const authData = getTelegramAuthData()
if (authData) {
  // Данные доступны
}
```

## Настройка

### Конфигурация API

URL эндпоинтов настраиваются в `app/config/api.ts`:

```typescript
export const API_URLS = {
  AUTH: {
    TELEGRAM_VALIDATE: 'https://naidizakupku.ru/api/auth/telegram/validate',
    TELEGRAM_SESSION: 'https://naidizakupku.ru/api/auth/telegram/session',
    // ...
  }
}
```

### Переменные окружения

```env
BACKEND_BASE_URL=http://localhost:9000/api
```

## Отладка

### Логирование

Все операции авторизации логируются в консоль:

```typescript
console.log('Auth data:', authData)
console.error('Login failed:', error)
```

### Проверка состояния

```typescript
import { isAuthenticated, getStoredUserData } from '@/utils/auth-helpers'

console.log('Is authenticated:', isAuthenticated())
console.log('User data:', getStoredUserData())
```

## Примеры

### Полный пример компонента

```tsx
'use client'

import { useAuthContext } from '@/components/auth-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { AuthButton } from '@/components/auth-button'

function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1>Профиль</h1>
        {user && (
          <div>
            <p>Имя: {user.firstName} {user.lastName}</p>
            <p>Username: @{user.username}</p>
            <p>Telegram ID: {user.telegramId}</p>
          </div>
        )}
        <AuthButton />
      </div>
    </ProtectedRoute>
  )
}
```
