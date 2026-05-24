import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { AnimatedCounter } from '../ui/AnimatedCounter'

const STATS = [
  { target: 500, suffix: '+', label: 'часов видеоконтента создано' },
  { target: 300, suffix: '+', label: 'часов обучения ИИ проведено' },
  { target: 2, suffix: '', label: 'федеральные премии за внедрение ИИ' },
  { target: 70, suffix: '%', label: 'экономия на создании контента' },
]

const WHY_CARDS = [
  {
    icon: '/assets/icons/neiroset.png',
    title: 'Реальный опыт',
    text: 'Проведение тренингов и создание видео для крупных международных компаний.',
  },
  {
    icon: '/assets/icons/Pioneers.png',
    title: 'Пионеры генеративного AI',
    text: 'Первыми в России использовали ИИ-ассистентов для обучения коммуникативным навыкам. Дважды лауреаты федеральных премий.',
  },
  {
    icon: '/assets/icons/roi.png',
    title: 'Измеримые результаты',
    text: 'Экономия до 70% на производстве контента. Качественные материалы на порядок дешевле традиционных методов.',
  },
  {
    icon: '/assets/icons/training.png',
    title: 'Доступно каждому',
    text: 'Обучаем от основ до продвинутого уровня. Корпоративные группы и индивидуальные форматы.',
  },
]

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  return (
    <section id="about" style={{ background: 'var(--bp-light-bg)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Section heading */}
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--bp-dark-blue)', marginBottom: 16 }}>
              Best Practice AI
            </h2>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: '#6b7280', maxWidth: 560, margin: '0 auto' }}>
              Эксперты в применении генеративного ИИ для бизнеса
            </p>
          </div>
        </FadeInSection>

        {/* Stats row */}
        <FadeInSection delay={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              background: 'var(--bp-dark-blue)',
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: 80,
              boxShadow: '0 24px 64px rgba(11,29,58,0.35)',
            }}
            className="stats-grid"
          >
            {STATS.map((stat, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  padding: '48px 28px 40px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  background: i % 2 === 0
                    ? 'radial-gradient(ellipse at 50% 0%, rgba(30,58,95,0.6) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)',
                }}
              >
                {/* Gold top accent */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40, height: 3,
                  background: 'var(--bp-gold)',
                  borderRadius: '0 0 4px 4px',
                  opacity: 0.9,
                }} />
                <div style={{
                  fontFamily: 'var(--bp-font-heading)',
                  fontWeight: 700,
                  fontSize: 'clamp(44px, 5vw, 64px)',
                  color: 'var(--bp-gold)',
                  lineHeight: 1,
                  marginBottom: 8,
                  letterSpacing: '-0.02em',
                }}>
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                {/* Thin gold divider under number */}
                <div style={{
                  width: 32, height: 1.5,
                  background: 'rgba(212,175,55,0.4)',
                  margin: '0 auto 12px',
                  borderRadius: 1,
                }} />
                <div style={{
                  fontFamily: 'var(--bp-font-body)',
                  fontSize: 13,
                  color: 'rgba(250,249,246,0.6)',
                  lineHeight: 1.5,
                  maxWidth: 120,
                  margin: '0 auto',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Why BP cards + expert photo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="about-grid">
          <FadeInSection delay={0.2}>
            <div>
              <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 32 }}>
                Почему Best Practice?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {WHY_CARDS.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'flex-start',
                      padding: 20,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <img src={card.icon} alt={card.title} style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 16, color: 'var(--bp-dark-blue)', marginBottom: 4 }}>
                        {card.title}
                      </h4>
                      <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                        {card.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Expert photo */}
          <FadeInSection delay={0.3}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{ position: 'relative' }}>
                {/* Gold ring */}
                <div style={{
                  position: 'absolute', inset: -8,
                  borderRadius: 24,
                  border: '2px solid var(--bp-gold)',
                  opacity: 0.4,
                }} />
                <img
                  src="/assets/about/expert-ai-illustration.png"
                  alt="Иван Салин — эксперт Best Practice AI"
                  style={{ width: '100%', maxWidth: 420, borderRadius: 20, display: 'block', boxShadow: '0 24px 64px rgba(11,29,58,0.2)' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--bp-dark-blue)', marginBottom: 4 }}>
                  Иван Салин
                </div>
                <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#6b7280', marginBottom: 20 }}>
                  Основатель Best Practice
                </div>
                <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
                  Узнать больше об Иване
                </div>
                <a
                  href="https://www.salinsafety.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--bp-font-heading)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--bp-dark-blue)',
                    textDecoration: 'none',
                    border: '1.5px solid var(--bp-dark-blue)',
                    borderRadius: 6,
                    padding: '8px 18px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bp-dark-blue)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--bp-gold)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--bp-dark-blue)'
                  }}
                >
                  salinsafety.ru
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 11 L11 1 M11 1 H5 M11 1 V7" />
                  </svg>
                </a>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
