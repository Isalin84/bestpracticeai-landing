import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.bp_admin_token

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-prod')
    ;(req as any).admin = payload
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}
