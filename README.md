# НайдиЗакупку - Платформа закупок

Информационная платформа для отслеживания и участия в государственных и коммерческих закупках с авторизацией через Telegram.

## 🚀 Возможности

- **Авторизация через Telegram** - Безопасный вход через Telegram Web App
- **Отслеживание закупок** - Просмотр актуальных тендеров и закупок
- **Личный кабинет** - Управление заявками и профилем пользователя
- **Новости закупок** - Актуальная информация о тендерах
- **Адаптивный дизайн** - Работает на всех устройствах

## 🔐 Авторизация через Telegram

### Как это работает

1. **Telegram Web App** - Приложение запускается внутри Telegram
2. **Автоматическая авторизация** - Данные пользователя передаются из Telegram
3. **Безопасная валидация** - Сервер проверяет подлинность данных
4. **Сессионное управление** - Поддержка множественных сессий

### API Endpoints

- `POST /api/auth/telegram/validate` - Валидация данных Telegram
- `GET /api/auth/telegram/session/{sessionId}` - Проверка сессии
- `DELETE /api/auth/telegram/logout` - Выход из сессии
- `DELETE /api/auth/telegram/logout/all` - Выход из всех сессий
- `GET /api/v1/verify-token` - Проверка JWT токена

## 🛠 Технологии

- **Frontend**: Next.js 14, React, TypeScript
- **Стилизация**: Tailwind CSS
- **Иконки**: Lucide React
- **Авторизация**: Telegram Web App API
- **Хранение**: localStorage + Server Sessions

## 📁 Структура проекта

```
app/
├── components/
│   ├── auth-provider.tsx      # Контекст авторизации
│   ├── auth-button.tsx        # Кнопка входа/выхода
│   ├── user-menu.tsx          # Меню пользователя
│   ├── protected-route.tsx    # Защита маршрутов
│   ├── auth-status.tsx        # Статус авторизации
│   ├── user-profile.tsx       # Профиль пользователя
│   └── auth-error.tsx         # Обработка ошибок
├── hooks/
│   ├── use-auth.ts            # Хук авторизации
│   └── use-api.ts             # Хук для API запросов
├── types/
│   └── auth.ts                # Типы авторизации
├── utils/
│   └── auth-helpers.ts        # Утилиты авторизации
├── config/
│   └── api.ts                 # Конфигурация API
├── profile/
│   └── page.tsx               # Страница профиля
└── my-purchases/
    └── page.tsx               # Защищенная страница
```

## 🚀 Установка и запуск

### Предварительные требования

- Node.js 18+
- npm или yarn
- Telegram Bot Token (для тестирования)

### Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd naidizakupku_front

# Установка зависимостей
npm install

# Создание .env.local файла
cp .env.example .env.local
```

### Настройка переменных окружения

```env
# .env.local
BACKEND_BASE_URL=https://naidizakupku.ru/api
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
```

### Запуск

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Продакшн
npm start
```

## 📱 Использование

### В браузере

1. Откройте приложение в браузере
2. Нажмите "Войти через Telegram"
3. Авторизуйтесь через Telegram
4. Получите доступ к защищенным функциям

### В Telegram

1. Найдите бота в Telegram
2. Запустите приложение через бота
3. Автоматическая авторизация
4. Полный доступ к функциям

## 🔒 Безопасность

### Валидация данных Telegram

- Проверка обязательных полей
- Валидация hash на сервере
- Проверка времени auth_date
- Защита от подделки данных

### Защита маршрутов

- Автоматическая проверка авторизации
- Защищенные страницы
- Обработка истечения сессий
- Безопасный выход из системы

## 📚 Документация

Подробная документация по авторизации доступна в [app/docs/telegram-auth.md](app/docs/telegram-auth.md)

## 🤝 Разработка

### Добавление защищенных страниц

```tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Защищенный контент</div>
    </ProtectedRoute>
  )
}
```

### Использование API с авторизацией

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
}
```

### Проверка авторизации

```tsx
import { useAuthContext } from '@/components/auth-provider'

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) return <div>Загрузка...</div>
  if (!isAuthenticated) return <div>Требуется авторизация</div>

  return <div>Привет, {user?.firstName}!</div>
}
```

## 🐛 Отладка

### Проверка состояния авторизации

```typescript
import { isAuthenticated, getStoredUserData } from '@/utils/auth-helpers'

console.log('Is authenticated:', isAuthenticated())
console.log('User data:', getStoredUserData())
```

### Логирование

Все операции авторизации логируются в консоль браузера для отладки.

## 📄 Лицензия

MIT License

## 🤝 Поддержка

Для вопросов и поддержки обращайтесь к документации или создавайте issues в репозитории.

