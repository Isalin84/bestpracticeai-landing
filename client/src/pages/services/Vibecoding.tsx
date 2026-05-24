import { Helmet } from 'react-helmet-async'
import { ServiceLayout, ContentBlock } from './ServiceLayout'

const PORTFOLIO = [
  { name: 'Vincent AI', description: 'Telegram-бот, развивающая игра для детей', href: '#' },
  { name: 'Kopilka', description: 'Трекер карманных денег — учит детей финансовой грамотности', href: '#' },
  { name: 'Aeterra', description: 'Лендинг страница', href: '#' },
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
            {PORTFOLIO.map(item => (
              <div
                key={item.name}
                style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(11,29,58,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--bp-gold)', marginBottom: 8 }}>
                  {item.name}
                </h3>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
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
