import { Router } from 'express'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const reviewsRouter = Router()

reviewsRouter.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM reviews WHERE published=1 ORDER BY sort_order ASC, id ASC').all())
})

reviewsRouter.get('/admin/all', authMiddleware, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM reviews ORDER BY sort_order ASC, id ASC').all())
})

reviewsRouter.post('/admin', authMiddleware, (req, res) => {
  const { name, position, company, text, photo_url, published, sort_order } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO reviews (name,position,company,text,photo_url,published,sort_order) VALUES (?,?,?,?,?,?,?)').run(name, position||null, company||null, text, photo_url||null, published?1:0, sort_order||0)
  res.status(201).json(db.prepare('SELECT * FROM reviews WHERE id=?').get(r.lastInsertRowid))
})

reviewsRouter.put('/admin/:id', authMiddleware, (req, res) => {
  const { name, position, company, text, photo_url, published, sort_order } = req.body
  const db = getDb()
  db.prepare('UPDATE reviews SET name=?,position=?,company=?,text=?,photo_url=?,published=?,sort_order=? WHERE id=?').run(name, position||null, company||null, text, photo_url||null, published?1:0, sort_order||0, req.params.id)
  res.json(db.prepare('SELECT * FROM reviews WHERE id=?').get(req.params.id))
})

reviewsRouter.delete('/admin/:id', authMiddleware, (req, res) => {
  getDb().prepare('DELETE FROM reviews WHERE id=?').run(req.params.id)
  res.json({ message: 'Deleted' })
})
