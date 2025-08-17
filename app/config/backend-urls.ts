// Централизованная конфигурация всех адресов бэкенда
export const BACKEND_URLS = {
  // Основные домены
  DOMAINS: {
    PRODUCTION: 'https://naidizakupku.ru',
    DEVELOPMENT: 'http://localhost:9000', // HTTP для локальной разработки
    LOCALHOST: 'http://127.0.0.1:9000', // HTTP для локальной разработки
    TELEGRAM_BOT_DEV: 'http://localhost:8080', // HTTP для локальной разработки
  },

  // API пути
  API_PATHS: {
    MAIN: '/api',
    BACKEND: '/api/backend/api',
  },

  // Полные URL для бэкенда
  BACKEND_ENDPOINTS: {
    // News endpoints
    NEWS: {
      TOP: '/news/top',
    },

    // Admin endpoints
    ADMIN: {
      COMMON_INFO: '/admin/common/info',
    },

    // Auth endpoints
    AUTH: {
      TELEGRAM: {
        VALIDATE: '/auth/telegram/validate',
        SESSION: '/auth/telegram/session',
        LOGOUT: '/auth/telegram/logout',
        LOGOUT_ALL: '/auth/telegram/logout/all',
      },
      TELEGRAM_BOT: {
        INFO: '/auth/telegram-bot/info',
        QR_CODE: '/auth/telegram-bot/qr-code',
        LOGIN: '/auth/telegram-bot/login',
      },
      VERIFY_TOKEN: '/v1/verify-token',
    },

    // User endpoints
    USER: {
      PROFILE: '/user/profile',
      PURCHASES: '/user/purchases',
    },

    // Tender endpoints
    TENDERS: {
      LIST: '/tenders',
      DETAIL: '/tenders/:id',
      SEARCH: '/tenders/search',
    },
  },

  // Внешние API
  EXTERNAL_APIS: {
    ZAKUPKI_GOV: {
      BASE: 'https://zakupki.gov.ru',
      NEWS: {
        NEWS_1: 'https://zakupki.gov.ru/epz/news/1',
        NEWS_2: 'https://zakupki.gov.ru/epz/news/2',
        NEWS_3: 'https://zakupki.gov.ru/epz/news/3',
      },
      SEARCH: 'https://zakupki.gov.ru/epz/order/extendedsearch/results.html',
    },
  },

  // Database URLs (оставляем localhost для локальной разработки)
  DATABASE: {
    POSTGRES_LOCAL: 'jdbc:postgresql://localhost:5432/naidizakupku',
  },

  // Email
  EMAIL: {
    SUPPORT: 'support@naidizakupku.ru',
  },
} as const

// Функции для построения URL (HTTPS для продакшена, HTTP для разработки)
export const buildBackendUrl = (endpoint: string, useHttps = true): string => {
  const directBackendBaseUrl = process.env.BACKEND_BASE_URL
  if (directBackendBaseUrl) return `${directBackendBaseUrl}${endpoint}`

  // Используем HTTPS для продакшена, HTTP для разработки
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? BACKEND_URLS.DOMAINS.PRODUCTION 
    : BACKEND_URLS.DOMAINS.DEVELOPMENT
  return `${baseUrl}${BACKEND_URLS.API_PATHS.BACKEND}${endpoint}`
}

export const buildDirectApiUrl = (endpoint: string, useHttps = true): string => {
  // Используем HTTPS для продакшена, HTTP для разработки
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? BACKEND_URLS.DOMAINS.PRODUCTION 
    : BACKEND_URLS.DOMAINS.DEVELOPMENT
  return `${baseUrl}${BACKEND_URLS.API_PATHS.MAIN}${endpoint}`
}

// Готовые URL для часто используемых endpoints
export const READY_URLS = {
  // News
  NEWS_TOP: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.NEWS.TOP),
  NEWS_TOP_DIRECT: buildDirectApiUrl(BACKEND_URLS.BACKEND_ENDPOINTS.NEWS.TOP),

  // Admin
  ADMIN_COMMON_INFO: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.ADMIN.COMMON_INFO),

  // Auth
  AUTH_TELEGRAM_VALIDATE: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM.VALIDATE),
  AUTH_TELEGRAM_SESSION: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM.SESSION),
  AUTH_TELEGRAM_LOGOUT: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM.LOGOUT),
  AUTH_TELEGRAM_LOGOUT_ALL: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM.LOGOUT_ALL),
  AUTH_TELEGRAM_BOT_INFO: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM_BOT.INFO),
  AUTH_TELEGRAM_BOT_QR_CODE: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM_BOT.QR_CODE),
  AUTH_TELEGRAM_BOT_LOGIN: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.TELEGRAM_BOT.LOGIN),
  AUTH_VERIFY_TOKEN: buildBackendUrl(BACKEND_URLS.BACKEND_ENDPOINTS.AUTH.VERIFY_TOKEN),

  // External
  ZAKUPKI_GOV_SEARCH: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.SEARCH,
  ZAKUPKI_GOV_NEWS_1: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_1,
  ZAKUPKI_GOV_NEWS_2: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_2,
  ZAKUPKI_GOV_NEWS_3: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_3,
} as const

// Типы для TypeScript
export type BackendEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS
export type NewsEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS.NEWS
export type AdminEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS.ADMIN
export type AuthEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS.AUTH
export type UserEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS.USER
export type TenderEndpoint = keyof typeof BACKEND_URLS.BACKEND_ENDPOINTS.TENDERS
