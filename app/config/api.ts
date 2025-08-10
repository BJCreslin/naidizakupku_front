// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: 'https://naidizakupku.ru',
  BASE_URL_HTTP: 'http://naidizakupku.ru',
  
  // API Paths
  API_PATH: '/api',
  BACKEND_PATH: '/api/backend',
  
  // Endpoints
  ENDPOINTS: {
    // News endpoints
    NEWS: {
      TOP: '/news/top',
    },
    
    // Admin endpoints
    ADMIN: {
      COMMON: {
        INFO: '/admin/common/info',
      },
    },
    
    // User endpoints (для будущего использования)
    USER: {
      PROFILE: '/user/profile',
      PURCHASES: '/user/purchases',
    },
    
    // Tender endpoints (для будущего использования)
    TENDERS: {
      LIST: '/tenders',
      DETAIL: '/tenders/:id',
      SEARCH: '/tenders/search',
    },
  },
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  
  // Cache settings
  CACHE: {
    REVALIDATE: 300, // 5 minutes
  },
} as const

// Helper functions для построения полных URL
export const buildApiUrl = (endpoint: string, useHttps = true): string => {
  // Если задан прямой BASE URL для backend (например, http://localhost:9000/api), используем его
  const directBackendBaseUrl = process.env.BACKEND_BASE_URL
  if (directBackendBaseUrl) return `${directBackendBaseUrl}${endpoint}`

  const baseUrl = useHttps ? API_CONFIG.BASE_URL : API_CONFIG.BASE_URL_HTTP
  return `${baseUrl}${API_CONFIG.BACKEND_PATH}${endpoint}`
}

// Функция для построения URL без /backend
export const buildDirectApiUrl = (endpoint: string, useHttps = true): string => {
  const baseUrl = useHttps ? API_CONFIG.BASE_URL : API_CONFIG.BASE_URL_HTTP
  return `${baseUrl}${API_CONFIG.API_PATH}${endpoint}`
}

export const buildNewsUrl = (endpoint: string): string => {
  return buildApiUrl(API_CONFIG.ENDPOINTS.NEWS[endpoint as keyof typeof API_CONFIG.ENDPOINTS.NEWS])
}

export const buildAdminUrl = (endpoint: string): string => {
  // Handle nested admin endpoints by flattening the path
  const endpointPath = endpoint.includes('.') 
    ? endpoint.split('.').reduce((obj: any, key) => obj[key], API_CONFIG.ENDPOINTS.ADMIN)
    : API_CONFIG.ENDPOINTS.ADMIN[endpoint as keyof typeof API_CONFIG.ENDPOINTS.ADMIN]
  
  return buildApiUrl(endpointPath as string)
}

// Готовые URL для часто используемых endpoints
export const API_URLS = {
  NEWS: {
    TOP: 'https://naidizakupku.ru/api/backend/news/top',
    TOP_DIRECT: buildDirectApiUrl(API_CONFIG.ENDPOINTS.NEWS.TOP),
  },
  ADMIN: {
    COMMON_INFO: 'https://naidizakupku.ru/api/backend/admin/common/info',
  },
} as const

// Типы для TypeScript
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS
export type NewsEndpoint = keyof typeof API_CONFIG.ENDPOINTS.NEWS
export type AdminEndpoint = keyof typeof API_CONFIG.ENDPOINTS.ADMIN
