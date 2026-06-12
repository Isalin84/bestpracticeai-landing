import { Router, type Response } from 'express'
import { readFileSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import MarkdownIt from 'markdown-it'
import { getDb } from '../db/database.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://bestpracticeai.ru'
const TEMPLATE_PATH = process.env.CLIENT_DIST
  ? join(process.env.CLIENT_DIST, 'index.html')
  : join(__dirname, '../../client/dist/index.html')

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

interface ArticleRow {
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_url: string | null
  created_at: string
  updated_at: string
}

const SERVICES: Record<string, { name: string; description: string }> = {
  'corporate-ai-video': {
    name: 'Корпоративные ИИ-видео с кастомными аватарами',
    description: 'Обучающие видео, инструктажи, онбординг и промо-ролики с ИИ-аватарами. Экономия до 70% на производстве корпоративного видеоконтента.',
  },
  'ai-video-training': {
    name: 'Обучение созданию ИИ-видео роликов',
    description: 'Программа обучения: от базы знаний до кастомного аватара, уникальной музыки и спецэффектов. Научим создавать ИИ-видео самостоятельно.',
  },
  'neural-networks-training': {
    name: 'Обучение применению нейросетей',
    description: 'Групповые и индивидуальные занятия: промптинг, выбор нейросетей, ИИ-ассистенты, агенты, вайбкодинг. Для бизнеса и частных лиц.',
  },
  'vibecoding': {
    name: 'Вайбкодинг и Telegram-боты',
    description: 'Разработка Telegram-ботов с ИИ, лендингов и цифровых продуктов методом вайбкодинга. Обучение программированию с ИИ.',
  },
  'additional': {
    name: 'Дополнительные услуги',
    description: 'Создание брендбука, нейрофотосессии, генерация музыки, персональные видеоаватары — генеративные нейросети под вашу задачу.',
  },
}

// --- Шаблон client/dist/index.html, кэш с проверкой mtime ---
let cachedTemplate = ''
let cachedMtime = 0

function getTemplate(): string {
  const mtime = statSync(TEMPLATE_PATH).mtimeMs
  if (!cachedTemplate || mtime !== cachedMtime) {
    cachedTemplate = readFileSync(TEMPLATE_PATH, 'utf-8')
    cachedMtime = mtime
  }
  return cachedTemplate
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return SITE_URL + (pathOrUrl.startsWith('/') ? pathOrUrl : '/' + pathOrUrl)
}

interface PageMeta {
  title: string
  description: string
  canonical: string
  ogType?: string
  ogImage?: string
  jsonLd?: object
  rootHtml?: string
  noindex?: boolean
}

function renderPage(meta: PageMeta): string {
  let html = getTemplate()
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const ogImage = absoluteUrl(meta.ogImage || '/assets/og/OG.jpg')

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
  html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`)
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`)
  html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${meta.ogType || 'website'}" />`)

  let headExtra = `    <link rel="canonical" href="${escapeHtml(meta.canonical)}" />\n`
  if (meta.noindex) {
    headExtra += `    <meta name="robots" content="noindex, nofollow" />\n`
  }
  if (meta.jsonLd) {
    // </script> внутри JSON-строк не встречается (контент экранируется markdown-it), но подстрахуемся
    const json = JSON.stringify(meta.jsonLd).replace(/<\//g, '<\\/')
    headExtra += `    <script type="application/ld+json">${json}</script>\n`
  }
  html = html.replace('</head>', headExtra + '  </head>')

  if (meta.rootHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${meta.rootHtml}</div>`)
  }
  return html
}

function sendHtml(res: Response, html: string, status = 200): void {
  // Страницы исторически отдавались nginx'ом без CSP; helmet-CSP заблокировал бы
  // Google Fonts и Метрику — убираем его только для HTML-страниц, API не трогаем
  res.removeHeader('Content-Security-Policy')
  res.status(status).type('html').send(html)
}

function defaultMeta(path: string): PageMeta {
  return {
    title: 'Best Practice AI — Генеративные нейросети для бизнеса и частных лиц',
    description: 'AI Студия Best Practice. Корпоративные ИИ-видео с кастомными аватарами, обучение работе с нейросетями, вайбкодинг.',
    canonical: absoluteUrl(path),
  }
}

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Best Practice AI',
  url: SITE_URL,
  logo: 'https://raw.githubusercontent.com/Isalin84/assets/main/media/LogoBP_YellowCircle.png',
  email: 'salinivan@mail.ru',
  telephone: '+7 (910) 170-11-26',
  founder: { '@type': 'Person', name: 'Иван Салин' },
}

export const seoRouter = Router()

// --- sitemap.xml ---
seoRouter.get('/sitemap.xml', (req, res) => {
  try {
    const articles = getDb()
      .prepare('SELECT slug, updated_at FROM articles WHERE published=1 ORDER BY created_at DESC')
      .all() as Pick<ArticleRow, 'slug' | 'updated_at'>[]

    const staticUrls = ['/', '/privacy', ...Object.keys(SERVICES).map(s => `/services/${s}`)]
    const entries: string[] = []
    for (const path of staticUrls) {
      entries.push(`  <url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc></url>`)
    }
    for (const a of articles) {
      const lastmod = a.updated_at ? `<lastmod>${new Date(a.updated_at + 'Z').toISOString().slice(0, 10)}</lastmod>` : ''
      entries.push(`  <url><loc>${SITE_URL}/blog/${escapeHtml(a.slug)}</loc>${lastmod}</url>`)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
    res.status(200).set('Content-Type', 'application/xml; charset=utf-8').send(xml)
  } catch (e) {
    console.error('sitemap error:', e)
    res.status(500).type('text/plain').send('sitemap unavailable')
  }
})

// --- Главная ---
seoRouter.get('/', (req, res) => {
  try {
    const articles = getDb()
      .prepare('SELECT slug, title FROM articles WHERE published=1 ORDER BY created_at DESC')
      .all() as Pick<ArticleRow, 'slug' | 'title'>[]

    const servicesHtml = Object.entries(SERVICES)
      .map(([slug, s]) => `<li><a href="/services/${slug}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.description)}</li>`)
      .join('\n')
    const articlesHtml = articles
      .map(a => `<li><a href="/blog/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></li>`)
      .join('\n')

    const rootHtml = `
<header><h1>Генеративные нейросети для бизнеса и частных лиц</h1></header>
<main>
<p>AI Студия Best Practice: создаём корпоративные ИИ-видео с кастомными аватарами, обучаем работе с нейросетями и разрабатываем цифровые продукты. Эксперт — Иван Салин: 500+ часов видеоконтента, 2 федеральные премии, до 70% экономии на производстве контента.</p>
<section><h2>Услуги</h2><ul>
${servicesHtml}
</ul></section>
<section><h2>Медиа — статьи о нейросетях</h2><ul>
${articlesHtml}
</ul></section>
<section><h2>Контакты</h2><p>Телефон: +7 (910) 170-11-26 · Email: salinivan@mail.ru · Telegram: @bestpractice_hs_ai</p></section>
</main>`

    sendHtml(res, renderPage({
      ...defaultMeta('/'),
      jsonLd: ORGANIZATION_LD,
      rootHtml,
    }))
  } catch (e) {
    console.error('seo home error:', e)
    sendHtml(res, getTemplate())
  }
})

// --- Статья блога ---
seoRouter.get('/blog/:slug', (req, res) => {
  try {
    const article = getDb()
      .prepare('SELECT * FROM articles WHERE slug=? AND published=1')
      .get(req.params.slug) as ArticleRow | undefined

    if (!article) {
      sendHtml(res, getTemplate(), 404)
      return
    }

    const canonical = `${SITE_URL}/blog/${article.slug}`
    const description = article.excerpt || article.content.replace(/[#*_\[\]()>`]/g, '').slice(0, 180).trim()
    const published = new Date(article.created_at + 'Z').toISOString()
    const modified = new Date((article.updated_at || article.created_at) + 'Z').toISOString()
    const dateHuman = new Date(article.created_at + 'Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description,
      image: absoluteUrl(article.cover_url || '/assets/og/OG.jpg'),
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      author: { '@type': 'Person', name: 'Иван Салин', url: SITE_URL },
      publisher: {
        '@type': 'Organization',
        name: 'Best Practice AI',
        logo: { '@type': 'ImageObject', url: 'https://raw.githubusercontent.com/Isalin84/assets/main/media/LogoBP_YellowCircle.png' },
      },
    }

    const rootHtml = `
<main>
<nav><a href="/">Главная</a> → <a href="/#media">Медиа</a></nav>
<article class="prose-bp">
<p>${dateHuman}</p>
<h1>${escapeHtml(article.title)}</h1>
${article.excerpt ? `<p><em>${escapeHtml(article.excerpt)}</em></p>` : ''}
${md.render(article.content)}
</article>
</main>`

    sendHtml(res, renderPage({
      title: `${article.title} — Best Practice AI`,
      description,
      canonical,
      ogType: 'article',
      ogImage: article.cover_url || undefined,
      jsonLd,
      rootHtml,
    }))
  } catch (e) {
    console.error('seo article error:', e)
    sendHtml(res, getTemplate())
  }
})

// --- Страницы услуг ---
seoRouter.get('/services/:slug', (req, res) => {
  try {
    const service = SERVICES[req.params.slug]
    if (!service) {
      sendHtml(res, getTemplate(), 404)
      return
    }
    const canonical = `${SITE_URL}/services/${req.params.slug}`
    const rootHtml = `
<main>
<nav><a href="/">Главная</a> → <a href="/#services">Услуги</a></nav>
<h1>${escapeHtml(service.name)}</h1>
<p>${escapeHtml(service.description)}</p>
<p>AI Студия Best Practice · <a href="/">bestpracticeai.ru</a> · +7 (910) 170-11-26</p>
</main>`
    sendHtml(res, renderPage({
      title: `${service.name} — Best Practice AI`,
      description: service.description,
      canonical,
      rootHtml,
    }))
  } catch (e) {
    console.error('seo service error:', e)
    sendHtml(res, getTemplate())
  }
})

// --- Политика конфиденциальности ---
seoRouter.get('/privacy', (req, res) => {
  try {
    sendHtml(res, renderPage({
      title: 'Политика обработки персональных данных — Best Practice AI',
      description: 'Политика обработки персональных данных сайта bestpracticeai.ru в соответствии со 152-ФЗ.',
      canonical: `${SITE_URL}/privacy`,
    }))
  } catch (e) {
    console.error('seo privacy error:', e)
    sendHtml(res, getTemplate())
  }
})

// --- Fallback для всех остальных GET-роутов (SPA: /admin и т.д.) ---
seoRouter.get('*', (req, res) => {
  try {
    if (req.path.startsWith('/admin')) {
      const html = getTemplate().replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>')
      sendHtml(res, html)
      return
    }
    sendHtml(res, getTemplate())
  } catch (e) {
    console.error('seo fallback error:', e)
    res.status(500).type('text/plain').send('Internal error')
  }
})
