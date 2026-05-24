import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    slug: 'corporate-ai-video',
    icon: '/assets/icons/icon-corporate-video.png',
    title: 'Корпоративные ИИ-видео',
    description: 'Обучающие ролики, инструктажи, онбординг и промо с вашим AI-аватаром',
    num: '01',
  },
  {
    slug: 'ai-video-training',
    icon: '/assets/icons/icon-video-training.png',
    title: 'Обучение созданию ИИ-видео',
    description: 'От базы знаний до кастомного аватара, музыки и спецэффектов — через доступные AI-инструменты',
    num: '02',
  },
  {
    slug: 'neural-networks-training',
    icon: '/assets/icons/icon-neural-training.png',
    title: 'Обучение нейросетям',
    description: 'Групповые и индивидуальные занятия — от промптинга до создания ИИ-агентов',
    num: '03',
  },
  {
    slug: 'vibecoding',
    icon: '/assets/icons/icon-vibecoding.png',
    title: 'Вайбкодинг & боты',
    description: 'Создаём Telegram-ботов с ИИ, лендинги и обучаем программировать с помощью AI',
    num: '04',
  },
  {
    slug: 'additional',
    icon: '/assets/icons/icon-additional.png',
    title: 'Дополнительные услуги',
    description: 'Брендбук, нейрофотосессии, генерация музыки, персональные видеоаватары',
    num: '05',
  },
]

const CARD_WIDTH = 'calc(33.333% - 16px)'

export function Services() {
  return (
    <section id="services" style={{ background: 'var(--bp-dark-blue)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: 16 }}>
            Наши услуги
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.55)', maxWidth: 600, margin: '0 auto' }}>
            Выберите то, что подходит именно вам — или свяжитесь с нами, и мы подберём оптимальное решение
          </p>
        </motion.div>

        {/* Row 1: 3 cards */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }} className="services-row">
          {SERVICES.slice(0, 3).map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} cardWidth={CARD_WIDTH} />
          ))}
        </div>

        {/* Row 2: 2 cards centered */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }} className="services-row">
          {SERVICES.slice(3).map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i + 3} cardWidth={CARD_WIDTH} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-row { flex-wrap: wrap !important; }
          .services-row > * { flex: 0 0 calc(50% - 12px) !important; min-width: 0 !important; }
        }
        @media (max-width: 640px) {
          .services-row > * { flex: 0 0 100% !important; }
        }
        .service-card-inner {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 36px 28px 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .service-card-inner:hover {
          transform: translateY(-4px);
          border-color: var(--bp-gold);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(212,175,55,0.3);
        }
        .service-card-inner:hover .service-arrow {
          transform: translateX(4px);
        }
        .service-arrow {
          transition: transform 0.2s ease;
        }
      `}</style>
    </section>
  )
}

function ServiceCard({ service, index, cardWidth }: {
  service: typeof SERVICES[0]
  index: number
  cardWidth: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ flex: `0 0 ${cardWidth}`, minWidth: 0 }}
    >
      <Link to={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="service-card-inner">
          {/* Number + icon row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'var(--bp-font-heading)',
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--bp-gold)',
              opacity: 0.7,
              letterSpacing: '0.08em',
            }}>
              {service.num}
            </span>
            <div style={{
              width: 60, height: 60,
              background: 'rgba(212,175,55,0.1)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <img src={service.icon} alt={service.title} style={{ width: 40, height: 40, objectFit: 'contain' }} />
            </div>
          </div>

          <h3 style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 18,
            color: '#fff',
            lineHeight: 1.3,
            margin: 0,
          }}>
            {service.title}
          </h3>

          <p style={{
            fontFamily: 'var(--bp-font-body)',
            fontSize: 14,
            color: 'rgba(250,249,246,0.55)',
            lineHeight: 1.65,
            flex: 1,
            margin: 0,
          }}>
            {service.description}
          </p>

          <div style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--bp-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingTop: 4,
            borderTop: '1px solid rgba(212,175,55,0.12)',
          }}>
            Подробнее
            <span className="service-arrow">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
