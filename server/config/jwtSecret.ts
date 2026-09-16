// Секрет JWT админ-сессии. Без него в проде сервер не стартует: раньше был фолбэк
// 'dev-secret-change-in-prod', с которым при потерянной переменной токен подделывался.
const secret = process.env.JWT_SECRET

if (!secret && process.env.NODE_ENV !== 'development') {
  throw new Error('JWT_SECRET не задан в окружении (server/.env). Запуск остановлен.')
}
if (!secret) {
  console.warn('WARNING: JWT_SECRET не задан — используется dev-секрет (только NODE_ENV=development).')
}

export const JWT_SECRET: string = secret || 'dev-only-secret'
