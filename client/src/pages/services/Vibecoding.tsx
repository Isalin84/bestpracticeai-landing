import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ServiceLayout, ContentBlock } from './ServiceLayout'

const PORTFOLIO = [
  { name: 'Vincent AI', description: 'Telegram-бот, развивающая игра для детей', href: 'https://t.me/VincentArt_bot' },
  { name: 'Kopilka', description: 'Трекер карманных денег — учит детей финансовой грамотности', href: '#' },
  { name: 'Aeterra', description: 'Лендинг страница', href: 'https://aeterra.bestpracticeai.ru/' },
]

export function Vibecoding() {
  return (
    <>
      <Helmet>
        <title>Вайбкодинг & Telegram-боты — Best Practice AI</title>
      </Helmet>
      <ServiceLayout
        slug="vibecoding"
        heroTitle="Вайбкодинг: цифровые продукты с помощью ИИ"
        heroSubtitle="Создаём функциональные Telegram-боты, лендинги и веб-приложения — быстро и без раздутых бюджетов на разработку."
        ctaLabel="Обсудить проект"
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }} className="service-detail-grid">
            <ContentBlock
              title="Что мы создаём"
              items={[
                'Telegram-боты с встроенным ИИ (чат-ассистенты, автоответы, игры)',
                'Лендинги и посадочные страницы',
                'Интерактивные веб-приложения и дашборды',
                'Инструменты автоматизации бизнес-процессов',
              ]}
            />
            <ContentBlock
              title="Обучение вайбкодингу"
              items={[
                'Создание цифровых продуктов с помощью ИИ без знания программирования',
                'Для предпринимателей, менеджеров и всех, у кого есть идея',
                'Индивидуальное и групповое обучение',
              ]}
            />
          </div>

          {/* Portfolio */}
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
            Примеры наших работ
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="portfolio-grid">
            {PORTFOLIO.map(item => {
              const isLink = item.href !== '#'
              const cardStyle: React.CSSProperties = {
                background: '#fff',
                borderRadius: 16,
                padding: '28px 24px',
                border: '1px solid rgba(11,29,58,0.08)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                textDecoration: 'none',
                display: 'block',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                ...(isLink ? { cursor: 'pointer' } : {}),
              }
              const inner = (
                <>
                  <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--bp-gold)', marginBottom: 8 }}>
                    {item.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {item.description}
                  </p>
                  {isLink && (
                    <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 13, color: 'var(--bp-dark-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Открыть
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 11 L11 1 M11 1 H5 M11 1 V7" />
                      </svg>
                    </span>
                  )}
                </>
              )
              return isLink ? (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" style={cardStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bp-gold)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,175,55,0.15)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(11,29,58,0.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.name} style={cardStyle}>{inner}</div>
              )
            })}
          </div>
        </div>
      </ServiceLayout>
      <style>{`
        @media (max-width: 768px) {
          .service-detail-grid { grid-template-columns: 1fr !important; }
          .portfolio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
