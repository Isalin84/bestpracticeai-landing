import { Router } from 'express'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getPublishedService, getPublishedServices, rowToDto, type ServiceRow } from '../db/services.js'

export const servicesRouter = Router()

const SLUG_RE = /^[a-z0-9-]{2,64}$/

servicesRouter.get('/', (req, res) => {
  res.json(getPublishedServices(getDb()))
})

servicesRouter.get('/admin/all', authMiddleware, (req, res) => {
  const rows = getDb().prepare('SELECT * FROM services ORDER BY sort_order ASC, slug ASC').all() as ServiceRow[]
  res.json(rows.map(rowToDto))
})

servicesRouter.get('/:slug', (req, res) => {
  const service = getPublishedService(getDb(), req.params.slug)
  if (!service) return res.status(404).json({ error: 'Not found' })
  res.json(service)
})

function readBody(body: Record<string, unknown>) {
  const str = (v: unknown, def = '') => (typeof v === 'string' ? v : def)
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])
  return {
    name: str(body.name).trim(),
    seo_title: str(body.title ?? body.seo_title).trim(),
    seo_description: str(body.description ?? body.seo_description).trim(),
    hero_subtitle: str(body.hero_subtitle),
    card_image: str(body.card_image) || null,
    card_num: str(body.card_num) || null,
    card_description: str(body.card_description),
    blocks: JSON.stringify(arr(body.blocks)),
    faq: JSON.stringify(arr(body.faq)),
    portfolio: JSON.stringify(arr(body.portfolio)),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    published: body.published === false || body.published === 0 ? 0 : 1,
  }
}

servicesRouter.post('/admin', authMiddleware, (req, res) => {
  const slug = String(req.body?.slug ?? '').trim()
  if (!SLUG_RE.test(slug)) return res.status(400).json({ error: 'Некорректный slug' })
  const data = readBody(req.body ?? {})
  if (!data.name || !data.seo_title || !data.seo_description) {
    return res.status(400).json({ error: 'Название, SEO-заголовок и описание обязательны' })
  }
  const db = getDb()
  if (db.prepare('SELECT 1 FROM services WHERE slug=?').get(slug)) {
    return res.status(409).json({ error: 'Услуга с таким slug уже существует' })
  }
  db.prepare(`
    INSERT INTO services (slug, name, seo_title, seo_description, hero_subtitle, card_image, card_num, card_description, blocks, faq, portfolio, sort_order, published)
    VALUES (@slug, @name, @seo_title, @seo_description, @hero_subtitle, @card_image, @card_num, @card_description, @blocks, @faq, @portfolio, @sort_order, @published)
  `).run({ slug, ...data })
  res.status(201).json(rowToDto(db.prepare('SELECT * FROM services WHERE slug=?').get(slug) as ServiceRow))
})

servicesRouter.put('/admin/:slug', authMiddleware, (req, res) => {
  const data = readBody(req.body ?? {})
  if (!data.name || !data.seo_title || !data.seo_description) {
    return res.status(400).json({ error: 'Название, SEO-заголовок и описание обязательны' })
  }
  const db = getDb()
  const r = db.prepare(`
    UPDATE services SET name=@name, seo_title=@seo_title, seo_description=@seo_description, hero_subtitle=@hero_subtitle,
      card_image=@card_image, card_num=@card_num, card_description=@card_description,
      blocks=@blocks, faq=@faq, portfolio=@portfolio, sort_order=@sort_order, published=@published,
      updated_at=CURRENT_TIMESTAMP
    WHERE slug=@slug
  `).run({ slug: req.params.slug, ...data })
  if (r.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rowToDto(db.prepare('SELECT * FROM services WHERE slug=?').get(req.params.slug) as ServiceRow))
})

servicesRouter.delete('/admin/:slug', authMiddleware, (req, res) => {
  getDb().prepare('DELETE FROM services WHERE slug=?').run(req.params.slug)
  res.json({ message: 'Deleted' })
})
