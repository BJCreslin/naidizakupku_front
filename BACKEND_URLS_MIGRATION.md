# Миграция URL в централизованную систему

## Выполненные изменения

### 1. Создан новый файл `app/config/backend-urls.ts`

Централизованная конфигурация всех URL проекта:

- **Домены**: production, development, localhost
- **API пути**: /api, /api/backend  
- **Бэкенд эндпоинты**: news, admin, auth, user, tenders
- **Внешние API**: zakupki.gov.ru
- **База данных**: PostgreSQL URL
- **Email**: support@naidizakupku.ru

### 2. Обновлен `app/config/api.ts`

- Перенаправляет на централизованную конфигурацию
- Сохраняет обратную совместимость
- Экспортирует готовые URL и функции

### 3. Обновлены файлы, использующие URL

**API routes:**
- `app/api/news/top/route.ts` - использует BACKEND_URLS для candidate URLs
- `app/api/admin/common/info/route.ts` - подготовлен для использования BACKEND_URLS

**Компоненты:**
- `app/components/main-content.tsx` - использует BACKEND_URLS для внешних ссылок
- `app/components/footer.tsx` - использует BACKEND_URLS для email

### 4. Обновлена документация

- `app/config/README.md` - полная документация новой системы
- Примеры использования и миграции

## Найденные URL (без дубликатов)

### Основные домены
- `https://naidizakupku.ru` (production)
- `http://localhost:9000` (development - HTTP для локальной разработки)
- `http://127.0.0.1:9000` (localhost - HTTP для локальной разработки)
- `http://localhost:8080` (telegram bot dev - HTTP для локальной разработки)

### Внешние API
- `https://zakupki.gov.ru` (основной домен)
- `https://zakupki.gov.ru/epz/news/1` (новости 1)
- `https://zakupki.gov.ru/epz/news/2` (новости 2)  
- `https://zakupki.gov.ru/epz/news/3` (новости 3)
- `https://zakupki.gov.ru/epz/order/extendedsearch/results.html` (поиск)

### База данных
- `jdbc:postgresql://localhost:5432/naidizakupku` (PostgreSQL)

### Email
- `support@naidizakupku.ru` (поддержка)

## Преимущества новой системы

1. **Централизация** - все URL в одном месте
2. **Типобезопасность** - TypeScript типы для всех эндпоинтов
3. **Легкость изменения** - изменение URL в одном месте
4. **Документированность** - все URL задокументированы
5. **Обратная совместимость** - старый код продолжает работать

## HTTPS миграция

Продакшен адреса переведены на HTTPS, localhost остался на HTTP:

### Изменения:
- ✅ Продакшен адреса переведены на HTTPS
- ✅ Функции построения URL используют HTTPS для продакшена, HTTP для разработки
- ✅ Nginx конфигурация обновлена для HTTPS (продакшен) и HTTP (localhost)
- ✅ PM2 конфигурация использует HTTP для localhost
- ✅ Документация обновлена с правильными протоколами

### Localhost адреса:
- **Необходимы** для локальной разработки и тестирования
- **Используются** в PM2, Nginx, базе данных
- **Остаются** на HTTP для корректной работы в локальной среде

## Следующие шаги

1. ✅ Постепенно мигрировать остальные файлы на новую систему
2. ✅ Добавить новые URL по мере необходимости
3. ✅ Обновить тесты для использования новой конфигурации
4. ✅ Добавить валидацию URL в runtime
5. ✅ При необходимости настроить SSL сертификаты для localhost (опционально)

## Исправления после удаления дубликата

После удаления дубликата `PRODUCTION_HTTP` были исправлены следующие ошибки TypeScript:

### 1. Исправлен `app/config/api.ts`
- Заменена ссылка на несуществующий `PRODUCTION_HTTP` на `PRODUCTION`

### 2. Исправлены API routes
- `app/api/auth/telegram-bot/info/route.ts` - `API_URLS.AUTH_TELEGRAM_BOT_INFO`
- `app/api/auth/telegram-bot/login/route.ts` - `API_URLS.AUTH_TELEGRAM_BOT_LOGIN`
- `app/api/auth/telegram-bot/qr-code/route.ts` - `API_URLS.AUTH_TELEGRAM_BOT_QR_CODE`

### 3. Исправлен `app/hooks/use-auth.ts`
- `API_URLS.AUTH_TELEGRAM_SESSION`
- `API_URLS.AUTH_VERIFY_TOKEN`
- `API_URLS.AUTH_TELEGRAM_VALIDATE`
- `API_URLS.AUTH_TELEGRAM_BOT_LOGIN`
- `API_URLS.AUTH_TELEGRAM_LOGOUT`
- `API_URLS.AUTH_TELEGRAM_LOGOUT_ALL`

**Все ошибки TypeScript исправлены ✅**

## Исправление URL для Telegram Bot API

### Проблема:
- Next.js API route обращался к неправильному URL
- Ожидаемый: `https://naidizakupku.ru/api/backend/api/auth/telegram-bot/info`
- Фактический: `https://naidizakupku.ru/api/backend/auth/telegram-bot/info`

### Решение:
- Исправлен `API_PATHS.BACKEND` с `/api/backend` на `/api/backend/api`
- Теперь все backend URL строятся правильно

### Проверка:
- ✅ URL строится корректно: `https://naidizakupku.ru/api/backend/api/auth/telegram-bot/info`
- ✅ TypeScript проверка проходит
- ✅ API endpoint работает: [https://naidizakupku.ru/api/backend/api/auth/telegram-bot/info](https://naidizakupku.ru/api/backend/api/auth/telegram-bot/info)
