import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CoverflowCarousel } from '../ui/CoverflowCarousel'
import { SectionSpotlight } from '../ui/SectionSpotlight'
import { api } from '../../api/client'

interface ServiceCardData {
  slug: string
  image: string
  title: string
  description: string
  num: string
}

// Карточки-фолбэк до загрузки из CMS (таблица services)
const SERVICES: ServiceCardData[] = [
  {
    slug: 'corporate-ai-video',
    image: '/assets/services/service-01-corporate-ai-video.webp',
    title: 'Создание корпоративных видео',
    description: 'Обучающие ролики, инструктажи, онбординг и промо с вашим AI-аватаром',
    num: '01',
  },
  {
    slug: 'ai-video-training',
    image: '/assets/services/service-02-ai-video-training.webp',
    title: 'Обучение созданию корпоративных видео с помощью ИИ',
    description: 'От базы знаний до кастомного аватара, музыки и спецэффектов',
    num: '02',
  },
  {
    slug: 'neural-networks-training',
    image: '/assets/services/service-03-neural-networks-training.webp',
    title: 'Генеративный ИИ в работе и в жизни',
    description: 'Групповые и индивидуальные занятия — от промптинга до создания ИИ-агентов',
    num: '03',
  },
  {
    slug: 'vibecoding',
    image: '/assets/services/service-04-vibecoding.webp',
    title: 'Разработка с помощью ИИ',
    description: 'Telegram-боты с ИИ, лендинги, приложения и обучение вайбкодингу',
    num: '04',
  },
  {
    slug: 'additional',
    image: '/assets/services/service-05-additional.webp',
    title: 'Дополнительные услуги',
    description: 'Брендбук, нейрофотосессии, генерация музыки, персональные видеоаватары',
    num: '05',
  },
]

export function Services() {
  const [services, setServices] = useState<ServiceCardData[]>(SERVICES)

  useEffect(() => {
    api.getServices()
      .then(list => {
        if (list.length === 0) return
        setServices(list.map((s, i) => ({
          slug: s.slug,
          image: s.card_image || SERVICES[i]?.image || SERVICES[0].image,
          title: s.name,
          description: s.card_description || s.description,
          num: s.card_num || String(i + 1).padStart(2, '0'),
        })))
      })
      .catch(() => {})
  }, [])

  return (
    <section id="services" className="bp-grain" style={{ background: 'var(--bp-dark-blue)', padding: '80px 0 72px', position: 'relative', overflow: 'hidden' }}>
      <div className="section-topline" aria-hidden="true" />
      <SectionSpotlight />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
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
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(32px, 4.5vw, 52px)', color: '#fff', marginBottom: 16 }}>
            Наши услуги
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.7)', maxWidth: 600, margin: '0 auto' }}>
            Выберите то, что подходит именно вам — или свяжитесь с нами, и мы подберём оптимальное решение
          </p>
        </motion.div>

      </div>

      {/* Coverflow на всю ширину экрана — карточки уходят за края как на референсе */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ padding: '0 16px' }}
      >
        <CoverflowCarousel
          items={services}
          getKey={s => s.slug}
          ariaLabel="Услуги"
          getShadowImage={s => s.image}
          renderCard={(service, isActive) => <ServiceCard service={service} isActive={isActive} />}
          renderTag={service => (
            <>
              <span style={{ opacity: 0.7 }}>{service.num}</span>
              {service.title}
            </>
          )}
        />
      </motion.div>

      <style>{`
        .service-photo-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          overflow: hidden;
          display: block;
          text-decoration: none;
          background: var(--bp-steel-blue);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          -webkit-user-drag: none;
        }
        .service-photo-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(160deg, rgba(212,175,55,0.55), rgba(212,175,55,0.08) 45%, rgba(212,175,55,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
          transition: opacity 0.3s ease;
        }
        .service-photo-card.is-active:hover {
          box-shadow: 0 28px 72px rgba(0,0,0,0.5), 0 0 48px rgba(212,175,55,0.14);
        }
        .service-photo-card.is-active:hover::before {
          background: linear-gradient(160deg, rgba(212,175,55,0.95), rgba(212,175,55,0.25) 45%, rgba(212,175,55,0.6));
        }
        .service-photo-card__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }
        .service-photo-card.is-active:hover .service-photo-card__img {
          transform: scale(1.05);
        }
        .service-photo-card__body {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .service-photo-card:not(.is-active) .service-photo-card__body {
          opacity: 0;
          transform: translateY(10px);
        }
        .service-photo-card__scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(11,29,58,0.25) 0%, rgba(11,29,58,0) 32%, rgba(11,29,58,0) 46%, rgba(11,29,58,0.88) 88%);
          pointer-events: none;
        }
        .service-photo-card__num {
          position: absolute;
          top: 20px;
          left: 24px;
          z-index: 2;
          font-family: var(--bp-font-heading);
          font-weight: 700;
          font-size: 64px;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(212,175,55,0.55);
          user-select: none;
        }
        .service-photo-card__body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .service-photo-card__more .service-arrow { transition: transform 0.2s ease; }
        .service-photo-card.is-active:hover .service-arrow { transform: translateX(4px); }
      `}</style>
    </section>
  )
}

function ServiceCard({ service, isActive }: { service: ServiceCardData; isActive: boolean }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className={`service-photo-card ${isActive ? 'is-active' : ''}`}
      draggable={false}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
    >
      <img
        src={service.image}
        alt={service.title}
        className="service-photo-card__img"
        loading="lazy"
        draggable={false}
      />
      <div className="service-photo-card__scrim" aria-hidden="true" />
      <span className="service-photo-card__num" aria-hidden="true">{service.num}</span>
      <div className="service-photo-card__body">
        <h3 style={{
          fontFamily: 'var(--bp-font-heading)',
          fontWeight: 600,
          fontSize: 'clamp(18px, 1.7vw, 24px)',
          color: '#fff',
          lineHeight: 1.25,
          margin: 0,
          textShadow: '0 2px 12px rgba(11,29,58,0.8)',
        }}>
          {service.title}
        </h3>
        <div className="service-photo-card__meta">
          <p style={{
            fontFamily: 'var(--bp-font-body)',
            fontSize: 14,
            color: 'rgba(250,249,246,0.78)',
            lineHeight: 1.55,
            margin: '0 0 10px',
          }}>
            {service.description}
          </p>
          <div className="service-photo-card__more" style={{
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--bp-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingTop: 10,
            borderTop: '1px solid rgba(212,175,55,0.22)',
          }}>
            Подробнее
            <span className="service-arrow">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
