import { Router, type Response } from 'express'
import { readFileSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import MarkdownIt from 'markdown-it'
import { getDb } from '../db/database.js'
import { getPublishedService, getPublishedServices } from '../db/services.js'

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

function breadcrumbLd(crumbs: { name: string; item: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
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

    // lastmod статичных страниц — дата сборки фронтенда (контент меняется только с деплоем)
    const staticLastmod = new Date(statSync(TEMPLATE_PATH).mtimeMs).toISOString().slice(0, 10)
    const staticUrls: { path: string; priority: string }[] = [
      { path: '/', priority: '1.0' },
      ...getPublishedServices(getDb()).map(s => ({ path: `/services/${s.slug}`, priority: '0.9' })),
      { path: '/privacy', priority: '0.3' },
    ]
    const entries: string[] = []
    for (const u of staticUrls) {
      entries.push(`  <url><loc>${SITE_URL}${u.path === '/' ? '/' : u.path}</loc><lastmod>${staticLastmod}</lastmod><priority>${u.priority}</priority></url>`)
    }
    for (const a of articles) {
      const lastmod = a.updated_at ? `<lastmod>${new Date(a.updated_at + 'Z').toISOString().slice(0, 10)}</lastmod>` : ''
      entries.push(`  <url><loc>${SITE_URL}/blog/${escapeHtml(a.slug)}</loc>${lastmod}<priority>0.8</priority></url>`)
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

    const servicesHtml = getPublishedServices(getDb())
      .map(s => `<li><a href="/services/${escapeHtml(s.slug)}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.description)}</li>`)
      .join('\n')
    const articlesHtml = articles
      .map(a => `<li><a href="/blog/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></li>`)
      .join('\n')

    // инлайн-оформление под бренд: этот блок виден долю секунды до загрузки React
    const rootHtml = `
<style>#root a{color:#D4AF37}#root h1,#root h2{font-family:Montserrat,sans-serif}</style>
<div style="background:linear-gradient(135deg,#0B1D3A 0%,#1E3A5F 100%);color:#FAF9F6;min-height:100vh;padding:120px 24px 64px;font-family:Lora,Georgia,serif">
<div style="max-width:1280px;margin:0 auto">
<header><h1 style="font-size:clamp(36px,5vw,56px);line-height:1.15;margin-bottom:24px">Генеративные нейросети <span style="color:#D4AF37">для бизнеса</span> и частных лиц</h1></header>
<main>
<p style="max-width:640px;line-height:1.7;opacity:.85">AI Студия Best Practice: создаём корпоративные ИИ-видео с кастомными аватарами, обучаем работе с нейросетями и разрабатываем цифровые продукты. Эксперт — Иван Салин: 500+ часов видеоконтента, 2 федеральные премии, до 70% экономии на производстве контента.</p>
<section><h2 style="margin:32px 0 12px">Услуги</h2><ul style="line-height:1.9;padding-left:20px">
${servicesHtml}
</ul></section>
<section><h2 style="margin:32px 0 12px">Блог — статьи о нейросетях</h2><ul style="line-height:1.9;padding-left:20px">
${articlesHtml}
</ul></section>
<section><h2 style="margin:32px 0 12px">Контакты</h2><p>Телефон: +7 (910) 170-11-26 · Email: salinivan@mail.ru · Telegram-канал: @bestpractice_ai · Личный Telegram: @isalin</p></section>
</main>
</div>
</div>`

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
      '@graph': [
        {
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
        },
        breadcrumbLd([
          { name: 'Главная', item: SITE_URL + '/' },
          { name: 'Блог', item: SITE_URL + '/#media' },
          { name: article.title, item: canonical },
        ]),
      ],
    }

    const rootHtml = `
<div style="background:#FAF9F6;min-height:100vh;padding:96px 24px 64px">
<main style="max-width:800px;margin:0 auto">
<nav style="font-size:13px;color:#9ca3af;margin-bottom:24px"><a href="/" style="color:#9ca3af">Главная</a> → <a href="/#media" style="color:#9ca3af">Блог</a></nav>
<article class="prose-bp">
<p style="font-size:13px;color:#9ca3af">${dateHuman}</p>
<h1 style="font-family:Montserrat,sans-serif;color:#0B1D3A;line-height:1.2">${escapeHtml(article.title)}</h1>
${article.excerpt ? `<p style="font-style:italic;color:#6b7280;border-left:4px solid #D4AF37;padding-left:20px"><em>${escapeHtml(article.excerpt)}</em></p>` : ''}
${md.render(article.content)}
</article>
</main>
</div>`

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
    const service = getPublishedService(getDb(), req.params.slug)
    if (!service) {
      sendHtml(res, getTemplate(), 404)
      return
    }
    const canonical = `${SITE_URL}/services/${req.params.slug}`

    const blocksHtml = service.blocks
      .map(b => `<section><h2 style="font-family:Montserrat,sans-serif;font-size:24px;margin:36px 0 14px;color:#D4AF37">${escapeHtml(b.heading)}</h2>
<ul style="line-height:1.9;padding-left:20px;opacity:.9">
${b.items.map(i => `<li>${escapeHtml(i)}</li>`).join('\n')}
</ul></section>`)
      .join('\n')

    const portfolioHtml = service.portfolio.length > 0
      ? `<section><h2 style="font-family:Montserrat,sans-serif;font-size:24px;margin:36px 0 14px;color:#D4AF37">Примеры наших работ</h2>
<ul style="line-height:1.9;padding-left:20px;opacity:.9">
${service.portfolio.map(p => `<li>${p.href ? `<a href="${escapeHtml(p.href)}" style="color:#D4AF37">${escapeHtml(p.name)}</a>` : `<strong>${escapeHtml(p.name)}</strong>`} — ${escapeHtml(p.description)}</li>`).join('\n')}
</ul></section>`
      : ''

    const faqHtml = `<section><h2 style="font-family:Montserrat,sans-serif;font-size:24px;margin:36px 0 14px;color:#D4AF37">Вопросы и ответы</h2>
${service.faq.map(f => `<h3 style="font-family:Montserrat,sans-serif;font-size:17px;margin:20px 0 8px">${escapeHtml(f.q)}</h3>
<p style="line-height:1.7;opacity:.85;margin:0">${escapeHtml(f.a)}</p>`).join('\n')}
</section>`

    const rootHtml = `
<div style="background:linear-gradient(135deg,#0B1D3A 0%,#1E3A5F 100%);color:#FAF9F6;min-height:100vh;padding:120px 24px 64px;font-family:Lora,Georgia,serif">
<main style="max-width:800px;margin:0 auto">
<nav style="font-size:13px;opacity:.6;margin-bottom:24px"><a href="/" style="color:inherit">Главная</a> → <a href="/#services" style="color:inherit">Услуги</a> → ${escapeHtml(service.name)}</nav>
<h1 style="font-family:Montserrat,sans-serif;font-size:clamp(28px,4vw,48px);line-height:1.2;margin-bottom:20px">${escapeHtml(service.name)}</h1>
<p style="font-size:18px;line-height:1.7;opacity:.8;margin:0 0 24px">${escapeHtml(service.hero_subtitle || service.description)}</p>
${blocksHtml}
${portfolioHtml}
${faqHtml}
<p style="opacity:.7;margin-top:40px">AI Студия Best Practice · <a href="/" style="color:#D4AF37">bestpracticeai.ru</a> · +7 (910) 170-11-26 · salinivan@mail.ru</p>
</main>
</div>`

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: canonical,
          serviceType: service.name,
          areaServed: 'RU',
          provider: {
            '@type': 'Organization',
            name: 'Best Practice AI',
            url: SITE_URL,
            telephone: '+7 (910) 170-11-26',
            email: 'salinivan@mail.ru',
          },
        },
        breadcrumbLd([
          { name: 'Главная', item: SITE_URL + '/' },
          { name: 'Услуги', item: SITE_URL + '/#services' },
          { name: service.name, item: canonical },
        ]),
        {
          '@type': 'FAQPage',
          mainEntity: service.faq.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    }

    sendHtml(res, renderPage({
      title: service.title,
      description: service.description,
      canonical,
      jsonLd,
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
