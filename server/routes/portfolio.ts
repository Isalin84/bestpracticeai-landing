import { Router } from 'express'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const portfolioRouter = Router()

portfolioRouter.get('/', (req, res) => {
  const { service_slug } = req.query
  const db = getDb()
  if (service_slug) {
    res.json(db.prepare('SELECT * FROM portfolio_videos WHERE service_slug=? AND published=1 ORDER BY sort_order ASC, id ASC').all(service_slug))
  } else {
    res.json(db.prepare('SELECT * FROM portfolio_videos WHERE published=1 ORDER BY sort_order ASC').all())
  }
})

portfolioRouter.get('/admin/all', authMiddleware, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM portfolio_videos ORDER BY sort_order ASC, created_at DESC').all())
})

portfolioRouter.post('/admin', authMiddleware, (req, res) => {
  const { service_slug, kinescope_id, title, caption, aspect_ratio, sort_order, published } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO portfolio_videos (service_slug,kinescope_id,title,caption,aspect_ratio,sort_order,published) VALUES (?,?,?,?,?,?,?)').run(service_slug, kinescope_id, title||null, caption||null, aspect_ratio||'16:9', sort_order||0, published?1:0)
  res.status(201).json(db.prepare('SELECT * FROM portfolio_videos WHERE id=?').get(r.lastInsertRowid))
})

portfolioRouter.put('/admin/:id', authMiddleware, (req, res) => {
  const { service_slug, kinescope_id, title, caption, aspect_ratio, sort_order, published } = req.body
  const db = getDb()
  db.prepare('UPDATE portfolio_videos SET service_slug=?,kinescope_id=?,title=?,caption=?,aspect_ratio=?,sort_order=?,published=? WHERE id=?').run(service_slug, kinescope_id, title||null, caption||null, aspect_ratio||'16:9', sort_order||0, published?1:0, req.params.id)
  res.json(db.prepare('SELECT * FROM portfolio_videos WHERE id=?').get(req.params.id))
})

portfolioRouter.delete('/admin/:id', authMiddleware, (req, res) => {
  getDb().prepare('DELETE FROM portfolio_videos WHERE id=?').run(req.params.id)
  res.json({ message: 'Deleted' })
})
