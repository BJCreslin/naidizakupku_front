# API Configuration

Этот файл содержит централизованную конфигурацию для всех API endpoints приложения.

## Структура

### `api.ts`
Основной файл конфигурации API с константами и утилитами.

### `utils/api-helpers.ts`
Утилиты для работы с API, включая обработку ошибок и типизированные функции.

## Использование

### 1. Импорт конфигурации
```typescript
import { API_CONFIG, API_URLS, buildApiUrl } from '@/config/api'
```

### 2. Использование готовых URL
```typescript
// Получение новостей
const newsUrl = API_URLS.NEWS.TOP

// Получение информации о проекте
const projectInfoUrl = API_URLS.ADMIN.COMMON_INFO
```

### 3. Построение URL динамически
```typescript
// Построение URL для новостей
const newsUrl = buildApiUrl('/news/top')

// Построение URL для админки
const adminUrl = buildApiUrl('/admin/common/info')
```

### 4. Использование утилит
```typescript
import { ApiHelpers } from '@/utils/api-helpers'

// GET запрос
const response = await ApiHelpers.get<News[]>('/news/top')

// POST запрос
const response = await ApiHelpers.post<User>('/user/profile', userData)

// Проверка здоровья API
const isHealthy = await ApiHelpers.checkHealth()
```

## Конфигурация

### Base URLs
- `BASE_URL`: HTTPS версия (https://naidizakupku.ru)
- `BASE_URL_HTTP`: HTTP версия (http://naidizakupku.ru)

### API Paths
- `API_PATH`: Базовый путь API (/api)
- `BACKEND_PATH`: Путь к backend API (/api/backend)

### URL Building Functions
- `buildApiUrl()`: Строит URL с `/api/backend` префиксом
- `buildDirectApiUrl()`: Строит URL с `/api` префиксом (для прямого доступа к backend)

### Endpoints
Все endpoints организованы по категориям:
- `NEWS`: Новости
- `ADMIN`: Административные функции
- `USER`: Пользовательские функции (для будущего использования)
- `TENDERS`: Закупки (для будущего использования)

### Headers
Стандартные заголовки для всех API запросов:
- `Content-Type: application/json`
- `Accept: application/json`
- `User-Agent`: Браузерный User-Agent

### Cache
Настройки кэширования:
- `REVALIDATE`: 300 секунд (5 минут)

## Добавление новых endpoints

1. Добавьте новый endpoint в `API_CONFIG.ENDPOINTS`
2. Создайте готовый URL в `API_URLS` если нужно
3. Добавьте соответствующие типы в TypeScript

### Пример добавления нового endpoint:
```typescript
// В API_CONFIG.ENDPOINTS
TENDERS: {
  LIST: '/tenders',
  DETAIL: '/tenders/:id',
  SEARCH: '/tenders/search',
},

// В API_URLS
TENDERS: {
  LIST: buildApiUrl(API_CONFIG.ENDPOINTS.TENDERS.LIST),
  SEARCH: buildApiUrl(API_CONFIG.ENDPOINTS.TENDERS.SEARCH),
},
```

## Изменение конфигурации

Для изменения базовых настроек API достаточно отредактировать файл `api.ts`:

- Изменить базовый URL: обновите `BASE_URL` и `BASE_URL_HTTP`
- Изменить путь к API: обновите `BACKEND_PATH`
- Изменить заголовки: обновите `DEFAULT_HEADERS`
- Изменить кэширование: обновите `CACHE.REVALIDATE`

Все изменения автоматически применятся ко всем API запросам в приложении.
