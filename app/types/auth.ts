export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
  query_id?: string
  user?: TelegramUser
  receiver?: TelegramUser
  chat?: {
    id: number
    type: string
    title?: string
    username?: string
  }
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  lang?: string
}

export interface AuthSession {
  sessionId: string
  telegramId: number
  username?: string
  firstName: string
  lastName?: string
  photoUrl?: string
  isActive: boolean
  createdAt: string
  lastActivityAt: string
}

export interface AuthResponse {
  success: boolean
  session?: AuthSession
  token?: string
  message?: string
  error?: string
}

export interface ValidateTelegramResponse {
  success: boolean
  session?: AuthSession
  token?: string
  message?: string
  error?: string
}

export interface SessionResponse {
  success: boolean
  session?: AuthSession
  message?: string
  error?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
  error?: string
}

export interface TokenVerifyResponse {
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

export interface TelegramBotInfo {
  botUsername: string
  botUrl: string
  qrCodeUrl?: string
}

export interface TelegramBotInfoResponse {
  success: boolean
  botInfo?: TelegramBotInfo
  error?: string
}

export interface TelegramBotQrCodeResponse {
  success: boolean
  qrCodeUrl?: string
  error?: string
}

export interface TelegramBotLoginResponse {
  success: boolean
  session?: AuthSession
  token?: string
  error?: string
}
