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
import { seoRouter } from './routes/seo.js'

const app = express()
const PORT = process.env.PORT || 3001

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

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// SEO: sitemap.xml и HTML-страницы с мета-тегами для поисковых роботов
// (nginx проксирует сюда все не-файловые запросы)
app.use(seoRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (!process.env.ADMIN_PASSWORD_HASH) {
    console.warn('\nWARNING: ADMIN_PASSWORD_HASH not set.')
    console.warn('Run: node server/scripts/create-admin.mjs\n')
  }
})
