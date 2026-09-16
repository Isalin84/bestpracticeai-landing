import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.js'
import { articlesRouter } from './routes/articles.js'
import { reviewsRouter } from './routes/reviews.js'
import { leadsRouter } from './routes/leads.js'
import { portfolioRouter } from './routes/portfolio.js'
import { settingsRouter } from './routes/settings.js'
import { servicesRouter } from './routes/services.js'
import { seoRouter } from './routes/seo.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001
// Слушаем только loopback (за nginx); HOST задаётся в ecosystem.config.cjs
const HOST = process.env.HOST || '127.0.0.1'

// За nginx: брать IP клиента из X-Forwarded-For (первый прокси), иначе express-rate-limit
// видит 127.0.0.1 у всех и лимиты заявок/логина срабатывают на всех посетителей разом.
app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://mc.yandex.ru'],
      frameSrc: ['https://kinescope.io'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

app.use(cors({
  origin: ['https://bestpracticeai.ru', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/leads', leadsRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/services', servicesRouter)

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// SEO: sitemap.xml и HTML-страницы с мета-тегами для поисковых роботов
// (nginx проксирует сюда все не-файловые запросы)
app.use(seoRouter)

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
  if (!process.env.ADMIN_PASSWORD_HASH) {
    console.warn('\nWARNING: ADMIN_PASSWORD_HASH not set.')
    console.warn('Run: node server/scripts/create-admin.mjs\n')
  }
})
