// API Configuration - использует централизованную конфигурацию URL
import { BACKEND_URLS, buildBackendUrl, buildDirectApiUrl, READY_URLS } from './backend-urls'

export const API_CONFIG = {
  // Base URLs (перенаправляем на централизованную конфигурацию)
  get BASE_URL() { return BACKEND_URLS.DOMAINS.PRODUCTION },
  get BASE_URL_HTTP() { return BACKEND_URLS.DOMAINS.PRODUCTION },
  
  // API Paths
  get API_PATH() { return BACKEND_URLS.API_PATHS.MAIN },
  get BACKEND_PATH() { return BACKEND_URLS.API_PATHS.BACKEND },
  
  // Endpoints (перенаправляем на централизованную конфигурацию)
  get ENDPOINTS() { return BACKEND_URLS.BACKEND_ENDPOINTS },
  
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

// Helper functions для построения полных URL (перенаправляем на централизованные функции)
export const buildApiUrl = buildBackendUrl
export { buildDirectApiUrl }

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

export const buildAuthUrl = (endpoint: string): string => {
  // Handle nested auth endpoints by flattening the path
  const endpointPath = endpoint.includes('.') 
    ? endpoint.split('.').reduce((obj: any, key) => obj[key], API_CONFIG.ENDPOINTS.AUTH)
    : API_CONFIG.ENDPOINTS.AUTH[endpoint as keyof typeof API_CONFIG.ENDPOINTS.AUTH]
  
  // Все auth эндпоинты используют backend путь
  return buildApiUrl(endpointPath as string)
}

// Готовые URL для часто используемых endpoints (перенаправляем на централизованные URL)
export const API_URLS = READY_URLS

// Типы для TypeScript (перенаправляем на централизованные типы)
export type { 
  BackendEndpoint, 
  NewsEndpoint, 
  AdminEndpoint, 
  AuthEndpoint,
  UserEndpoint,
  TenderEndpoint 
} from './backend-urls'
