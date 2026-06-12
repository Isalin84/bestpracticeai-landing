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

interface ServiceSeo {
  name: string // H1
  title: string // <title> с коммерческим интентом
  description: string // meta description
  blocks: { heading: string; items: string[] }[]
  faq: { q: string; a: string }[]
  portfolio?: { name: string; description: string; href?: string }[]
}

const SERVICES: Record<string, ServiceSeo> = {
  'corporate-ai-video': {
    name: 'Корпоративные ИИ-видео с кастомными аватарами',
    title: 'Корпоративные ИИ-видео с аватарами — заказать | Best Practice AI',
    description: 'Обучающие видео, инструктажи, онбординг и промо-ролики с ИИ-аватарами. Экономия до 70% на производстве корпоративного видеоконтента.',
    blocks: [
      {
        heading: 'Что мы создаём',
        items: [
          'Обучающие видео и курсы (для LMS-платформ)',
          'Видеоинструктажи и инструкции по охране труда',
          'Онбординг-видео для новых сотрудников',
          'Коммуникационные ролики для внутренних коммуникаций',
          'Промо и маркетинговые видео с AI-ведущим',
          'Видео для социальных сетей (форматы 16:9 и 9:16)',
        ],
      },
      {
        heading: 'Как это работает',
        items: [
          'Вы предоставляете материалы и сценарий (или мы помогаем написать)',
          'Мы создаём или используем ваш кастомный AI-аватар',
          'Записываем профессиональный видеоряд с озвучкой',
          'Добавляем брендинг, субтитры и спецэффекты',
          'Вы получаете готовый ролик',
        ],
      },
    ],
    faq: [
      { q: 'Сколько стоит корпоративное ИИ-видео?', a: 'Стоимость зависит от хронометража, количества роликов и сложности постановки. В среднем производство с ИИ-аватаром обходится до 70% дешевле классической видеосъёмки: не нужны студия, съёмочная команда и пересъёмки. Точный расчёт делаем после короткого брифа.' },
      { q: 'Что такое кастомный AI-аватар?', a: 'Это цифровая копия вашего спикера или эксперта, созданная по видеозаписи. Аватар создаётся один раз, после чего любые новые ролики записываются без участия человека в кадре — достаточно текста сценария.' },
      { q: 'Сколько времени занимает производство ролика?', a: 'Обычно от нескольких дней до двух-трёх недель в зависимости от объёма. Это значительно быстрее классической съёмки: не нужно согласовывать площадку, график спикера и пересъёмки.' },
      { q: 'Подойдут ли ИИ-видео для инструктажей по охране труда?', a: 'Да, это наше профильное направление. Основатель студии Иван Салин — эксперт по промышленной безопасности с 20-летним опытом, поэтому инструктажи и обучающие видео по ОТиПБ создаются с пониманием нормативных требований.' },
      { q: 'В каких форматах вы делаете видео?', a: 'Горизонтальные 16:9 для LMS, сайтов и презентаций и вертикальные 9:16 для соцсетей и мессенджеров. Добавляем фирменный стиль, субтитры и спецэффекты.' },
    ],
  },
  'ai-video-training': {
    name: 'Обучение созданию ИИ-видео роликов',
    title: 'Обучение созданию ИИ-видео с аватарами — курс | Best Practice AI',
    description: 'Научим создавать видеоролики с AI-аватарами самостоятельно: от базы знаний до кастомного аватара, уникальной музыки и спецэффектов.',
    blocks: [
      {
        heading: 'Программа обучения',
        items: [
          'Создание базы знаний из ваших материалов',
          'Написание сценариев с помощью ИИ',
          'Создание и настройка кастомного AI-аватара',
          'Генерация уникальной музыки под ваш контент',
          'Монтаж и добавление спецэффектов через ИИ-инструменты',
          'Публикация и продвижение готового контента',
        ],
      },
      {
        heading: 'Форматы',
        items: ['Групповой воркшоп (от 5 человек)', 'Индивидуальный интенсив', 'Онлайн и офлайн'],
      },
      {
        heading: 'Для кого',
        items: [
          'HR и L&D специалисты',
          'Маркетологи и контент-мейкеры',
          'Руководители, создающие обучающие материалы',
          'Все, кто хочет производить видеоконтент без дорогих съёмочных команд',
        ],
      },
    ],
    faq: [
      { q: 'Нужны ли навыки монтажа или программирования?', a: 'Нет. Обучение построено с нуля на доступных ИИ-инструментах: всё, что нужно — компьютер и желание. Монтаж, озвучка и спецэффекты делаются нейросетями.' },
      { q: 'Что я получу по итогам обучения?', a: 'Готовый видеоролик с AI-аватаром, созданный лично вами в ходе обучения, плюс набор инструментов и методику для самостоятельного производства видеоконтента.' },
      { q: 'Какие форматы обучения доступны?', a: 'Групповой воркшоп от 5 человек, индивидуальный интенсив. Проводим и онлайн, и офлайн — формат подбираем под вашу задачу.' },
      { q: 'Сколько длится обучение?', a: 'От однодневного интенсива до серии занятий — программа собирается под уровень группы и цели. Свяжитесь с нами, и мы предложим оптимальный вариант.' },
    ],
  },
  'neural-networks-training': {
    name: 'Обучение применению нейросетей',
    title: 'Обучение нейросетям для бизнеса и частных лиц | Best Practice AI',
    description: 'Групповые и индивидуальные занятия: промптинг, выбор нейросетей, ИИ-ассистенты, агенты, вайбкодинг. Практика без теоретической воды.',
    blocks: [
      {
        heading: 'Темы программы',
        items: [
          'Основы промптинга: как получать нужные результаты от любого ИИ',
          'Обзор и выбор нейросетей под ваши задачи',
          'ИИ для текста, изображений, видео и аудио',
          'Создание персональных ИИ-ассистентов',
          'Автоматизация рутины с помощью ИИ-агентов',
          'Вайбкодинг: создание приложений без знания программирования',
          'ИИ для конкретных функций: HR, маркетинг, операции, безопасность',
        ],
      },
      {
        heading: 'Форматы',
        items: ['Корпоративный тренинг (группа от 5 до 30 человек)', 'Индивидуальные занятия', 'Онлайн и офлайн'],
      },
    ],
    faq: [
      { q: 'Подойдёт ли обучение новичкам без опыта работы с ИИ?', a: 'Да. Программа строится от уровня группы: начинаем с основ промптинга и выбора инструментов, без теоретической воды — только то, что сразу применяется в работе.' },
      { q: 'Кто ведёт занятия?', a: 'Иван Салин — пионер применения генеративного ИИ в бизнесе, 500+ часов обучения нейросетям, дважды лауреат федеральных премий, эксперт по промышленной безопасности с 20-летним опытом.' },
      { q: 'Какие форматы и размер группы?', a: 'Корпоративный тренинг для групп от 5 до 30 человек, индивидуальные занятия. Онлайн и офлайн — по договорённости.' },
      { q: 'Можно ли адаптировать программу под нашу отрасль?', a: 'Да, программа кастомизируется под функции и задачи: HR, маркетинг, операции, охрана труда и промышленная безопасность. Перед обучением собираем бриф и подбираем кейсы из вашей сферы.' },
    ],
  },
  'vibecoding': {
    name: 'Вайбкодинг и Telegram-боты',
    title: 'Разработка Telegram-ботов с ИИ и вайбкодинг — заказать | Best Practice AI',
    description: 'Разработка Telegram-ботов с ИИ, лендингов и цифровых продуктов методом вайбкодинга. Быстро и без раздутых бюджетов. Обучение вайбкодингу.',
    blocks: [
      {
        heading: 'Что мы создаём',
        items: [
          'Telegram-боты с встроенным ИИ (чат-ассистенты, автоответы, игры)',
          'Лендинги и посадочные страницы',
          'Интерактивные веб-приложения и дашборды',
          'Инструменты автоматизации бизнес-процессов',
        ],
      },
      {
        heading: 'Обучение вайбкодингу',
        items: [
          'Создание цифровых продуктов с помощью ИИ без знания программирования',
          'Для предпринимателей, менеджеров и всех, у кого есть идея',
          'Индивидуальное и групповое обучение',
        ],
      },
    ],
    portfolio: [
      { name: 'Vincent AI', description: 'Telegram-бот, развивающая игра для детей', href: 'https://t.me/VincentArt_bot' },
      { name: 'Kopilka', description: 'Трекер карманных денег — учит детей финансовой грамотности' },
      { name: 'Aeterra', description: 'Лендинг страница', href: 'https://aeterra.bestpracticeai.ru/' },
    ],
    faq: [
      { q: 'Что такое вайбкодинг?', a: 'Это разработка цифровых продуктов с помощью генеративного ИИ: нейросеть пишет код по описанию задачи, а человек направляет процесс. Получается в разы быстрее и дешевле классической разработки.' },
      { q: 'Что можно заказать?', a: 'Telegram-боты с встроенным ИИ (чат-ассистенты, автоответы, игры), лендинги и посадочные страницы, веб-приложения, дашборды и инструменты автоматизации бизнес-процессов.' },
      { q: 'Сколько времени занимает разработка Telegram-бота?', a: 'Простые боты делаются за несколько дней, продукты с ИИ-логикой — за пару недель. После брифа называем точный срок и стоимость.' },
      { q: 'Есть ли примеры готовых работ?', a: 'Да: Vincent AI — Telegram-бот с развивающей игрой для детей, Kopilka — трекер карманных денег для обучения финансовой грамотности, Aeterra — лендинг.' },
      { q: 'Можно ли научиться вайбкодингу самому?', a: 'Да, мы обучаем вайбкодингу индивидуально и в группах — без предварительных знаний программирования. Подходит предпринимателям и менеджерам, у которых есть идея продукта.' },
    ],
  },
  'additional': {
    name: 'Дополнительные услуги',
    title: 'Нейрофотосессии, ИИ-музыка, брендбук, видеоаватары | Best Practice AI',
    description: 'Создание брендбука, нейрофотосессии, генерация музыки, персональные видеоаватары — генеративные нейросети под вашу задачу.',
    blocks: [
      {
        heading: 'Что входит',
        items: [
          'Создание брендбука: визуальная идентичность с помощью ИИ — логотип, цветовая палитра, типографика, правила применения',
          'Нейрофотосессии: профессиональные AI-портреты и корпоративные фото без фотостудии',
          'Генерация музыки: уникальные треки для видео, презентаций и брендинга',
          'Персональный видеоаватар: цифровая копия для видеороликов — создаётся один раз, используется бесконечно',
        ],
      },
    ],
    faq: [
      { q: 'Что такое нейрофотосессия?', a: 'Это профессиональные портреты и корпоративные фото, созданные генеративным ИИ на основе ваших реальных фотографий. Премиальный визуальный контент без студии, визажиста и долгих съёмок.' },
      { q: 'Как создаётся персональный видеоаватар?', a: 'Один раз записывается короткое видео с вами, по нему обучается цифровая копия. Дальше аватар озвучивает любые сценарии — новые ролики без съёмок.' },
      { q: 'Музыка будет уникальной?', a: 'Да, треки генерируются под ваш бренд и задачу — для видеороликов, презентаций и аудиобрендинга.' },
      { q: 'Можно ли заказать брендбук с нуля?', a: 'Да: разработаем визуальную идентичность с помощью ИИ-инструментов — логотип, палитру, типографику и правила применения в едином стиле.' },
    ],
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
      ...Object.keys(SERVICES).map(s => ({ path: `/services/${s}`, priority: '0.9' })),
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

    const servicesHtml = Object.entries(SERVICES)
      .map(([slug, s]) => `<li><a href="/services/${slug}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.description)}</li>`)
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
<section><h2 style="margin:32px 0 12px">Медиа — статьи о нейросетях</h2><ul style="line-height:1.9;padding-left:20px">
${articlesHtml}
</ul></section>
<section><h2 style="margin:32px 0 12px">Контакты</h2><p>Телефон: +7 (910) 170-11-26 · Email: salinivan@mail.ru · Telegram: @bestpractice_hs_ai</p></section>
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
          { name: 'Медиа', item: SITE_URL + '/#media' },
          { name: article.title, item: canonical },
        ]),
      ],
    }

    const rootHtml = `
<div style="background:#FAF9F6;min-height:100vh;padding:96px 24px 64px">
<main style="max-width:800px;margin:0 auto">
<nav style="font-size:13px;color:#9ca3af;margin-bottom:24px"><a href="/" style="color:#9ca3af">Главная</a> → <a href="/#media" style="color:#9ca3af">Медиа</a></nav>
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
    const service = SERVICES[req.params.slug]
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

    const portfolioHtml = service.portfolio
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
<p style="font-size:18px;line-height:1.7;opacity:.8;margin:0 0 24px">${escapeHtml(service.description)}</p>
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
