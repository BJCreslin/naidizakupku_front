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

1. Постепенно мигрировать остальные файлы на новую систему
2. Добавить новые URL по мере необходимости
3. Обновить тесты для использования новой конфигурации
4. Добавить валидацию URL в runtime
5. При необходимости настроить SSL сертификаты для localhost (опционально)
