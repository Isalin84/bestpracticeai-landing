import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'

export const authRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Слишком много попыток. Попробуйте через 15 минут.' },
})

authRouter.post('/login', loginLimiter, async (req, res) => {
  const { password } = req.body
  const hash = process.env.ADMIN_PASSWORD_HASH

  if (!hash) {
    res.status(500).json({ message: 'Admin password not configured. Run create-admin script.' })
    return
  }

  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    res.status(401).json({ message: 'Неверный пароль' })
    return
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'dev-secret-change-in-prod', { expiresIn: '8h' })

  res.cookie('bp_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000,
  })

  res.json({ message: 'Logged in' })
})

authRouter.post('/logout', (req, res) => {
  res.clearCookie('bp_admin_token')
  res.json({ message: 'Logged out' })
})

authRouter.get('/me', (req, res) => {
  const token = req.cookies?.bp_admin_token
  if (!token) { res.status(401).json({ message: 'Not authenticated' }); return }
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-prod')
    res.json({ admin: true })
  } catch {
    res.status(401).json({ message: 'Token expired' })
  }
})
