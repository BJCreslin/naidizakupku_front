# Руководство по устранению проблем сборки

## Проблема: Ошибка 502 при сборке

### Описание
```
Error fetching news: Error: Backend API error: 502
```

### Причина
Next.js пытается получить данные во время статической сборки, но внешний API недоступен.

### Решение

#### 1. Использовать безопасную сборку
```bash
npm run build:safe
```

#### 2. Очистить кэш и пересобрать
```bash
npm run build:clean
```

#### 3. Проверить переменные окружения
Создайте файл `.env.local` на основе `env.example`:
```bash
cp env.example .env.local
```

#### 4. Настройка для продакшена
Для продакшена используйте:
```bash
NODE_ENV=production npm run build
```

## Fallback данные

Приложение настроено для работы с fallback данными:

### Новости
- API endpoint: `/api/news/top`
- Fallback: 3 демонстрационные новости
- Статус: ✅ Реализовано

### Информация о проекте
- API endpoint: `/api/admin/common/info`
- Fallback: Статистика проекта
- Статус: ✅ Реализовано

### Авторизация
- API endpoints: `/api/auth/telegram/*`
- Fallback: Локальная авторизация
- Статус: ✅ Реализовано

## Настройки для разных окружений

### Разработка
```bash
npm run dev
```

### Продакшен
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t naidizakupku-front .
docker run -p 3000:3000 naidizakupku-front
```

## Мониторинг

### Логи сборки
```bash
npm run build 2>&1 | tee build.log
```

### Проверка типов
```bash
npm run type-check
```

### Линтинг
```bash
npm run lint
```

## Частые проблемы

### 1. Ошибки TypeScript
```bash
npm run type-check
```

### 2. Проблемы с зависимостями
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Проблемы с кэшем
```bash
npm run clean
npm run build
```

### 4. Проблемы с API
- Проверьте доступность внешних API
- Используйте fallback данные
- Настройте правильные URL в конфигурации

## Контакты

При возникновении проблем:
1. Проверьте логи сборки
2. Убедитесь в доступности API
3. Используйте fallback данные
4. Обратитесь к документации
