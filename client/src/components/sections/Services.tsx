import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TiltCard } from '../ui/TiltCard'
import { SectionSpotlight } from '../ui/SectionSpotlight'

const SERVICES = [
  {
    slug: 'corporate-ai-video',
    icon: '/assets/icons/icon-corporate-video.png',
    title: 'Создание корпоративных видеороликов',
    description: 'Обучающие ролики, инструктажи, онбординг и промо с вашим AI-аватаром',
    num: '01',
  },
  {
    slug: 'ai-video-training',
    icon: '/assets/icons/icon-video-training.png',
    title: 'Обучение созданию корпоративных обучающих роликов с помощью ИИ',
    description: 'От базы знаний до кастомного аватара, музыки и спецэффектов — через доступные AI-инструменты',
    num: '02',
  },
  {
    slug: 'neural-networks-training',
    icon: '/assets/icons/icon-neural-training.png',
    title: 'Обучение использованию генеративного ИИ в работе и жизни',
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
    <section id="services" style={{ background: 'var(--bp-dark-blue)', padding: '96px 0', position: 'relative' }}>
      <div className="section-topline" aria-hidden="true" />
      <SectionSpotlight />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--bp-gold)',
            marginBottom: 14,
          }}>
            Best Practice AI
          </div>
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: 16 }}>
            Наши услуги
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.7)', maxWidth: 600, margin: '0 auto' }}>
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
          position: relative;
          background: linear-gradient(160deg, rgba(42,79,122,0.45) 0%, rgba(30,58,95,0.35) 40%, rgba(11,29,58,0.6) 100%);
          border-radius: 16px;
          padding: 36px 28px 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .service-card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(160deg, rgba(212,175,55,0.55), rgba(212,175,55,0.1) 45%, rgba(212,175,55,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .service-card-inner:hover {
          transform: translateY(-4px);
          background: linear-gradient(160deg, rgba(42,79,122,0.6) 0%, rgba(30,58,95,0.5) 40%, rgba(11,29,58,0.7) 100%);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 40px rgba(212,175,55,0.12);
        }
        .service-card-inner:hover::before {
          background: linear-gradient(160deg, rgba(212,175,55,0.9), rgba(212,175,55,0.25) 45%, rgba(212,175,55,0.55));
        }
        .service-card-inner:hover .service-arrow {
          transform: translateX(4px);
        }
        .service-card-inner:hover .service-more {
          color: var(--bp-soft-gold);
        }
        .service-card-inner:hover .service-icon-img {
          filter: drop-shadow(0 0 16px rgba(212,175,55,0.55));
        }
        .service-arrow {
          transition: transform 0.2s ease;
        }
        .service-num-watermark {
          position: absolute;
          top: 18px;
          left: 22px;
          font-family: var(--bp-font-heading);
          font-weight: 700;
          font-size: 68px;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(212,175,55,0.3);
          pointer-events: none;
          user-select: none;
        }
        .service-icon-img {
          filter: drop-shadow(0 0 12px rgba(212,175,55,0.35));
          transition: filter 0.25s ease;
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
        <TiltCard style={{ height: '100%' }}>
        <div className="service-card-inner" style={{ transformStyle: 'preserve-3d' }}>
          <span className="service-num-watermark" aria-hidden="true">{service.num}</span>

          {/* Icon row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{
              width: 64, height: 64,
              background: 'radial-gradient(circle at 30% 25%, rgba(212,175,55,0.35), rgba(212,175,55,0.08))',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transform: 'translateZ(28px)',
            }}>
              <img src={service.icon} alt={service.title} className="service-icon-img" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            </div>
          </div>

          <h3 style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 19,
            color: '#fff',
            lineHeight: 1.3,
            margin: 0,
          }}>
            {service.title}
          </h3>

          <p style={{
            fontFamily: 'var(--bp-font-body)',
            fontSize: 14,
            color: 'rgba(250,249,246,0.72)',
            lineHeight: 1.65,
            flex: 1,
            margin: 0,
          }}>
            {service.description}
          </p>

          <div className="service-more" style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--bp-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingTop: 8,
            borderTop: '1px solid rgba(212,175,55,0.18)',
            transition: 'color 0.2s ease',
          }}>
            Подробнее
            <span className="service-arrow">→</span>
          </div>
        </div>
        </TiltCard>
      </Link>
    </motion.div>
  )
}
