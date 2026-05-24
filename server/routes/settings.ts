import { Router } from 'express'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const settingsRouter = Router()

settingsRouter.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  const result: Record<string, string> = {}
  for (const row of rows) result[row.key] = row.value
  res.json(result)
})

settingsRouter.put('/admin/:key', authMiddleware, (req, res) => {
  const { value } = req.body
  const db = getDb()
  db.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(req.params.key, value)
  res.json({ message: 'Updated', key: req.params.key, value })
})
