import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import type { ServiceFaq } from '../../types'

export type FaqItem = ServiceFaq

interface Props {
  slug: string
  name: string
  seoTitle: string
  seoDescription: string
  heroSubtitle: string
  ctaLabel?: string
  faq?: FaqItem[]
  children: React.ReactNode
}

export function ServiceLayout({ slug, name, seoTitle, seoDescription, heroSubtitle, ctaLabel = 'Оставить заявку', faq, children }: Props) {
  const scrollToContacts = () => {
    window.location.href = '/#contacts'
  }

  const canonical = `https://bestpracticeai.ru/services/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name,
        description: seoDescription,
        url: canonical,
        serviceType: name,
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
          { '@type': 'ListItem', position: 3, name, item: canonical },
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
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
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
        <span style={{ color: 'var(--bp-dark-blue)' }}>{name}</span>
      </div>

      {/* Hero */}
      <section className="bp-grain" style={{ position: 'relative', background: 'linear-gradient(135deg, var(--bp-dark-blue), var(--bp-steel-blue))', padding: '72px 24px' }}>
        <div className="section-topline" aria-hidden="true" />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(30px,4.5vw,52px)', color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
              {name}
            </h1>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.78)', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 36px' }}>
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
      <section className="bp-grain" style={{ position: 'relative', background: 'var(--bp-dark-blue)', padding: '72px 24px', textAlign: 'center' }}>
        <div className="section-topline" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}
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
