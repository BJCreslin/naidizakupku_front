# Конфигурация API и URL

## Обзор

В проекте используется централизованная система конфигурации URL для всех внешних API и бэкенд-сервисов. Это обеспечивает единообразие и упрощает управление адресами.

## Файлы конфигурации

### `backend-urls.ts` - Централизованная конфигурация URL

Основной файл с всеми URL проекта:

```typescript
import { BACKEND_URLS, READY_URLS, buildBackendUrl } from '@/config/backend-urls'
```

**Структура:**
- `DOMAINS` - Основные домены (production, development, localhost)
- `API_PATHS` - Пути API (/api, /api/backend)
- `BACKEND_ENDPOINTS` - Все эндпоинты бэкенда
- `EXTERNAL_APIS` - Внешние API (zakupki.gov.ru)
- `DATABASE` - URL базы данных
- `EMAIL` - Email адреса

### `api.ts` - Совместимость с существующим кодом

Файл для обратной совместимости, который перенаправляет на централизованную конфигурацию:

```typescript
import { API_CONFIG, API_URLS, buildApiUrl } from '@/config/api'
```

## Использование

### Получение готовых URL

```typescript
import { READY_URLS } from '@/config/backend-urls'

// Использование готовых URL
const newsUrl = READY_URLS.NEWS_TOP
const authUrl = READY_URLS.AUTH_TELEGRAM_VALIDATE
const externalUrl = READY_URLS.ZAKUPKI_GOV_SEARCH
```

### Построение URL динамически

```typescript
import { buildBackendUrl, buildDirectApiUrl } from '@/config/backend-urls'

// Построение URL для бэкенда
const url = buildBackendUrl('/news/top')

// Построение URL без /backend
const directUrl = buildDirectApiUrl('/news/top')
```

### Доступ к конфигурации

```typescript
import { BACKEND_URLS } from '@/config/backend-urls'

// Домены
const prodDomain = BACKEND_URLS.DOMAINS.PRODUCTION
const devDomain = BACKEND_URLS.DOMAINS.DEVELOPMENT

// Внешние API
const zakupkiNews = BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_1

// Email
const supportEmail = BACKEND_URLS.EMAIL.SUPPORT
```

## Переменные окружения

### BACKEND_BASE_URL

Переменная для переопределения базового URL бэкенда:

```bash
# Для разработки (локальный бэкенд)
BACKEND_BASE_URL=http://localhost:9000/api

# Для продакшена
BACKEND_BASE_URL=https://naidizakupku.ru/api
```

### Localhost адреса

В проекте используются localhost адреса для:

1. **Локальная разработка** - `http://localhost:9000` для бэкенда
2. **PM2 конфигурация** - для запуска Next.js приложения
3. **Nginx прокси** - для проксирования запросов к бэкенду
4. **База данных** - `localhost:5432` для PostgreSQL
5. **Telegram Bot** - `http://localhost:8080` для локального тестирования

**Важно:** Localhost адреса используют HTTP для корректной работы в локальной среде.

## Типы TypeScript

```typescript
import type { 
  BackendEndpoint, 
  NewsEndpoint, 
  AdminEndpoint, 
  AuthEndpoint,
  UserEndpoint,
  TenderEndpoint 
} from '@/config/backend-urls'
```

## Миграция с старой системы

### Старый способ:
```typescript
const url = 'https://naidizakupku.ru/api/backend/news/top'
```

### Новый способ:
```typescript
import { READY_URLS } from '@/config/backend-urls'
const url = READY_URLS.NEWS_TOP
```

## Преимущества централизованной конфигурации

1. **Единообразие** - Все URL в одном месте
2. **Типобезопасность** - TypeScript типы для всех эндпоинтов
3. **Легкость изменения** - Изменение URL в одном месте
4. **Документированность** - Все URL задокументированы
5. **Обратная совместимость** - Старый код продолжает работать

## Добавление новых URL

1. Добавить в `BACKEND_URLS` в соответствующую секцию
2. Добавить в `READY_URLS` если URL часто используется
3. Добавить TypeScript тип если необходимо
4. Обновить документацию
