import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const SERVICE_NAMES: Record<string, string> = {
  'corporate-ai-video': 'Создание корпоративных видеороликов',
  'ai-video-training': 'Обучение созданию обучающих роликов',
  'neural-networks-training': 'Обучение генеративному ИИ',
  'vibecoding': 'Вайбкодинг & боты',
  'additional': 'Дополнительные услуги',
}

// Синхронизировано с server/routes/seo.ts (SSR-версии страниц для поисковиков)
const SERVICE_SEO: Record<string, { title: string; description: string }> = {
  'corporate-ai-video': {
    title: 'Создание корпоративных видеороликов с ИИ — заказать | Best Practice AI',
    description: 'Обучающие видео, инструктажи, онбординг и промо-ролики с ИИ-аватарами. Экономия до 70% на производстве корпоративного видеоконтента.',
  },
  'ai-video-training': {
    title: 'Обучение созданию обучающих роликов с помощью ИИ | Best Practice AI',
    description: 'Научим создавать корпоративные обучающие ролики с AI-аватарами самостоятельно: от базы знаний до кастомного аватара, музыки и спецэффектов.',
  },
  'neural-networks-training': {
    title: 'Обучение генеративному ИИ для работы и жизни | Best Practice AI',
    description: 'Групповые и индивидуальные занятия: промптинг, выбор нейросетей, ИИ-ассистенты, агенты, вайбкодинг. Практика без теоретической воды.',
  },
  'vibecoding': {
    title: 'Разработка Telegram-ботов с ИИ и вайбкодинг — заказать | Best Practice AI',
    description: 'Разработка Telegram-ботов с ИИ, лендингов и цифровых продуктов методом вайбкодинга. Быстро и без раздутых бюджетов. Обучение вайбкодингу.',
  },
  'additional': {
    title: 'Нейрофотосессии, ИИ-музыка, брендбук, видеоаватары | Best Practice AI',
    description: 'Создание брендбука, нейрофотосессии, генерация музыки, персональные видеоаватары — генеративные нейросети под вашу задачу.',
  },
}

export interface FaqItem {
  q: string
  a: string
}

interface Props {
  slug: string
  heroTitle: string
  heroSubtitle: string
  ctaLabel?: string
  faq?: FaqItem[]
  children: React.ReactNode
}

export function ServiceLayout({ slug, heroTitle, heroSubtitle, ctaLabel = 'Оставить заявку', faq, children }: Props) {
  const scrollToContacts = () => {
    window.location.href = '/#contacts'
  }

  const canonical = `https://bestpracticeai.ru/services/${slug}`
  const seo = SERVICE_SEO[slug] || { title: `${heroTitle} — Best Practice AI`, description: heroSubtitle }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: SERVICE_NAMES[slug] || heroTitle,
        description: seo.description,
        url: canonical,
        serviceType: SERVICE_NAMES[slug] || heroTitle,
        areaServed: 'RU',
        provider: {
          '@type': 'Organization',
          name: 'Best Practice AI',
          url: 'https://bestpracticeai.ru',
          telephone: '+7 (910) 170-11-26',
          email: 'salinivan@mail.ru',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://bestpracticeai.ru/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://bestpracticeai.ru/#services' },
          { '@type': 'ListItem', position: 3, name: SERVICE_NAMES[slug] || heroTitle, item: canonical },
        ],
      },
      ...(faq && faq.length > 0
        ? [{
            '@type': 'FAQPage',
            mainEntity: faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ],
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bestpracticeai.ru/assets/og/OG.jpg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px', display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af' }}>
        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Главная</Link>
        <span>→</span>
        <Link to="/#services" style={{ color: '#9ca3af', textDecoration: 'none' }}>Услуги</Link>
        <span>→</span>
        <span style={{ color: 'var(--bp-dark-blue)' }}>{SERVICE_NAMES[slug]}</span>
      </div>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--bp-dark-blue), var(--bp-steel-blue))', padding: '72px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>
              {heroTitle}
            </h1>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.75)', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 36px' }}>
              {heroSubtitle}
            </p>
            <button onClick={scrollToContacts} className="btn-primary">
              {ctaLabel}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div style={{ background: 'var(--bp-light-bg)', minHeight: 400 }}>
        {children}
      </div>

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section style={{ background: 'var(--bp-light-bg)', padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(24px,3vw,32px)', color: 'var(--bp-dark-blue)', marginBottom: 28, textAlign: 'center' }}
            >
              Вопросы и ответы
            </motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faq.map((item, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="faq-item"
                >
                  <summary>
                    {item.q}
                    <span className="faq-chevron" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <p>{item.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
          <style>{`
            .faq-item {
              background: #fff;
              border: 1px solid rgba(11,29,58,0.08);
              border-radius: 14px;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .faq-item[open] {
              border-color: rgba(212,175,55,0.45);
              box-shadow: 0 8px 24px rgba(11,29,58,0.07);
            }
            .faq-item summary {
              list-style: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 18px 22px;
              font-family: var(--bp-font-heading);
              font-weight: 600;
              font-size: 16px;
              color: var(--bp-dark-blue);
            }
            .faq-item summary::-webkit-details-marker { display: none; }
            .faq-chevron {
              flex-shrink: 0;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(212,175,55,0.12);
              color: var(--bp-gold);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.25s ease, background 0.2s;
            }
            .faq-item[open] .faq-chevron {
              transform: rotate(180deg);
              background: var(--bp-gold);
              color: var(--bp-dark-blue);
            }
            .faq-item p {
              font-family: var(--bp-font-body);
              font-size: 15px;
              line-height: 1.7;
              color: #374151;
              margin: 0;
              padding: 0 22px 20px;
            }
          `}</style>
        </section>
      )}

      {/* Final CTA */}
      <section style={{ background: 'var(--bp-dark-blue)', padding: '72px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', color: '#fff', marginBottom: 16 }}>
            Готовы начать?
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 17, color: 'rgba(250,249,246,0.65)', marginBottom: 32 }}>
            Свяжитесь с нами — обсудим вашу задачу и предложим решение
          </p>
          <button onClick={scrollToContacts} className="btn-primary">
            Свяжитесь с нами
          </button>
        </motion.div>
      </section>
    </div>
  )
}

function ContentBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', marginBottom: 16 }}>
        {title}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bp-gold)', marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--bp-font-body)', fontSize: 16, color: '#374151', lineHeight: 1.6 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ContentBlock }
