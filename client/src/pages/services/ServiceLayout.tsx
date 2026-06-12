import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const SERVICE_NAMES: Record<string, string> = {
  'corporate-ai-video': 'Корпоративные ИИ-видео',
  'ai-video-training': 'Обучение ИИ-видео',
  'neural-networks-training': 'Обучение нейросетям',
  'vibecoding': 'Вайбкодинг & боты',
  'additional': 'Дополнительные услуги',
}

interface Props {
  slug: string
  heroTitle: string
  heroSubtitle: string
  ctaLabel?: string
  children: React.ReactNode
}

export function ServiceLayout({ slug, heroTitle, heroSubtitle, ctaLabel = 'Оставить заявку', children }: Props) {
  const scrollToContacts = () => {
    window.location.href = '/#contacts'
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <Helmet>
        <title>{`${SERVICE_NAMES[slug] || heroTitle} — Best Practice AI`}</title>
        <meta name="description" content={heroSubtitle} />
        <link rel="canonical" href={`https://bestpracticeai.ru/services/${slug}`} />
        <meta property="og:title" content={`${SERVICE_NAMES[slug] || heroTitle} — Best Practice AI`} />
        <meta property="og:description" content={heroSubtitle} />
        <meta property="og:url" content={`https://bestpracticeai.ru/services/${slug}`} />
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
