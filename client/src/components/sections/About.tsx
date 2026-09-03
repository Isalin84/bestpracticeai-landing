import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { DragCarousel } from '../ui/DragCarousel'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

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
    text: 'Проведение тренингов по ИИ, создание корпоративных видео и разработка с помощью ИИ для крупных международных компаний.',
  },
  {
    icon: '/assets/icons/Pioneers.png',
    title: 'Пионеры генеративного AI',
    text: 'Первыми в России использовали ИИ-ассистентов для обучения коммуникативным навыкам. Дважды лауреаты федеральных премий.',
  },
  {
    icon: '/assets/icons/roi.png',
    title: 'Измеримые результаты',
    text: 'Экономия до 70% на производстве контента. Увеличение эффективности за счет созданных приложений с помощью ИИ сотрудниками после обучения.',
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
    <Section id="about" tone="light" padding="72px 0" backdrop={{ position: 'center 30%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeading title="Best Practice AI" marginBottom={40} />

        {/* Stats row */}
        <FadeInSection delay={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              background: 'var(--bp-dark-blue)',
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: 40,
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

        {/* Why BP cards — карусель */}
        <FadeInSection delay={0.2}>
          <DragCarousel ariaLabel="Почему Best Practice" theme="light" gap={24} arrowsAlign="right">
            {WHY_CARDS.map((card, i) => (
              <div key={i} className="why-card">
                <div className="why-card__icon">
                  <img src={card.icon} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} draggable={false} />
                </div>
                <div className="why-card__num" aria-hidden="true">0{i + 1}</div>
                <h4 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 21, color: 'var(--bp-dark-blue)', margin: '0 0 12px', lineHeight: 1.25 }}>
                  {card.title}
                </h4>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15.5, color: '#4b5563', lineHeight: 1.65, margin: 0 }}>
                  {card.text}
                </p>
              </div>
            ))}
          </DragCarousel>
        </FadeInSection>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .why-card {
          position: relative;
          width: clamp(300px, 34vw, 440px);
          padding: 36px 32px 32px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(11,29,58,0.06);
          box-shadow: var(--bp-shadow-card);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          user-select: none;
        }
        .why-card::before {
          content: '';
          position: absolute;
          top: 0; left: 32px; right: 32px;
          height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, var(--bp-gold), var(--bp-soft-gold));
          opacity: 0.85;
        }
        .why-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212,175,55,0.45);
          box-shadow: var(--bp-shadow-card-hover), 0 0 40px rgba(212,175,55,0.12);
        }
        .why-card__icon {
          width: 72px; height: 72px;
          border-radius: 18px;
          background: radial-gradient(circle at 30% 25%, rgba(212,175,55,0.22), rgba(212,175,55,0.06));
          border: 1px solid rgba(212,175,55,0.3);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .why-card__num {
          position: absolute;
          top: 28px; right: 28px;
          font-family: var(--bp-font-heading);
          font-weight: 700;
          font-size: 40px;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(11,29,58,0.18);
        }
      `}</style>
    </Section>
  )
}
