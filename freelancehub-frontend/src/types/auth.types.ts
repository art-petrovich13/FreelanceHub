// Данные для регистрации
export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'Student' | 'Employer'
  university?: string
  specialty?: string
}

// Данные для входа
export interface LoginData {
  email: string
  password: string
}

// Ответ сервера после успешного входа/регистрации
export interface AuthResponse {
  accessToken: string
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  expiresAt: string
}