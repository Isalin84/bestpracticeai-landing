import { Router } from 'express'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const articlesRouter = Router()

// Public
articlesRouter.get('/', (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 6
  const offset = (page - 1) * limit
  const db = getDb()
  const articles = db.prepare('SELECT * FROM articles WHERE published=1 ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit + 1, offset)
  const hasMore = articles.length > limit
  res.json({ articles: articles.slice(0, limit), hasMore, total: db.prepare('SELECT COUNT(*) as c FROM articles WHERE published=1').get() })
})

articlesRouter.get('/:slug', (req, res) => {
  const article = getDb().prepare('SELECT * FROM articles WHERE slug=? AND published=1').get(req.params.slug)
  if (!article) { res.status(404).json({ message: 'Not found' }); return }
  res.json(article)
})

// Admin CRUD
articlesRouter.get('/admin/all', authMiddleware, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM articles ORDER BY created_at DESC').all())
})

articlesRouter.post('/admin', authMiddleware, (req, res) => {
  const { slug, title, excerpt, content, cover_url, published } = req.body
  const db = getDb()
  const result = db.prepare(
    'INSERT INTO articles (slug,title,excerpt,content,cover_url,published) VALUES (?,?,?,?,?,?)'
  ).run(slug, title, excerpt || null, content || '', cover_url || null, published ? 1 : 0)
  const created = db.prepare('SELECT * FROM articles WHERE id=?').get(result.lastInsertRowid)
  res.status(201).json(created)
})

articlesRouter.put('/admin/:id', authMiddleware, (req, res) => {
  const { slug, title, excerpt, content, cover_url, published } = req.body
  const db = getDb()
  db.prepare(
    'UPDATE articles SET slug=?,title=?,excerpt=?,content=?,cover_url=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(slug, title, excerpt || null, content || '', cover_url || null, published ? 1 : 0, req.params.id)
  res.json(db.prepare('SELECT * FROM articles WHERE id=?').get(req.params.id))
})

articlesRouter.delete('/admin/:id', authMiddleware, (req, res) => {
  getDb().prepare('DELETE FROM articles WHERE id=?').run(req.params.id)
  res.json({ message: 'Deleted' })
})
