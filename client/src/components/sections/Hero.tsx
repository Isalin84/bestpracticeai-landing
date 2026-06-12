import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DeviceFrame } from '../ui/DeviceFrame'
import { ParticleBackground } from '../ui/ParticleBackground'
import { scrollToId } from '../../hooks/useLenis'

interface Props {
  kinescopeId: string
}

const H1_WORDS: { text: string; gold?: boolean; breakAfter?: boolean }[] = [
  { text: 'Генеративные' },
  { text: 'нейросети', breakAfter: true },
  { text: 'для', gold: true },
  { text: 'бизнеса', gold: true },
  { text: 'и' },
  { text: 'частных' },
  { text: 'лиц' },
]

export function Hero({ kinescopeId }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Параллакс: фон отстаёт, видео чуть опережает, контент мягко гаснет
  const yAurora = useTransform(scrollYProgress, [0, 1], [0, 140])
  const yPattern = useTransform(scrollYProgress, [0, 1], [0, 90])
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 70])
  const yDevice = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])

  const scrollToContacts = () => scrollToId('contacts')
  const scrollToServices = () => scrollToId('services')

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, var(--bp-dark-blue) 0%, var(--bp-steel-blue) 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 72,
      }}
    >
      {/* Aurora glow background (parallax) */}
      <motion.div className="hero-aurora" aria-hidden="true" style={{ y: yAurora }}>
        <div className="hero-aurora__blob hero-aurora__blob--steel" />
        <div className="hero-aurora__blob hero-aurora__blob--gold" />
        <div className="hero-aurora__blob hero-aurora__blob--soft" />
      </motion.div>
      <div className="hero-aurora" aria-hidden="true">
        <div className="hero-aurora__topline" />
        <div className="hero-aurora__vignette" />
      </div>

      {/* Particle animation */}
      <ParticleBackground />

      {/* Decorative SVG background (parallax) */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -100,
          top: '50%',
          y: yPattern,
          width: '60%',
          maxWidth: 700,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/hero/hero-bg-pattern.svg"
          alt=""
          style={{ width: '100%', opacity: 0.08, transform: 'translateY(-50%)' }}
        />
      </motion.div>

      {/* Decorative gold dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--bp-gold)',
            opacity: 0.4,
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
        />
      ))}

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
          width: '100%',
        }}
        className="hero-grid"
      >
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ y: yContent, opacity: contentOpacity }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 28,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bp-gold)' }} />
            <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, color: 'var(--bp-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Студия · bestpracticeai.ru
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--bp-font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 56px)',
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            {H1_WORDS.map((word, i) => (
              <span key={i}>
                <motion.span
                  initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-block', color: word.gold ? 'var(--bp-gold)' : undefined }}
                >
                  {word.text}
                </motion.span>
                {word.breakAfter ? <br /> : ' '}
              </span>
            ))}
          </h1>

          <p
            style={{
              fontFamily: 'var(--bp-font-body)',
              fontSize: 18,
              color: 'rgba(250,249,246,0.8)',
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 520,
            }}
          >
            Создаём корпоративные ИИ-видео, обучаем работе с нейросетями и разрабатываем цифровые продукты.
            Экспертиза × Искусственный интеллект × Результат.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={scrollToContacts} className="btn-primary">
              Оставить заявку
            </button>
            <button onClick={scrollToServices} className="btn-primary-outline">
              Смотреть услуги
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { num: '500+', label: 'часов видео' },
              { num: '2', label: 'федеральные премии' },
              { num: '70%', label: 'экономия' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--bp-gold)' }}>
                  {item.num}
                </div>
                <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: 'rgba(250,249,246,0.6)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          style={{ display: 'flex', justifyContent: 'center', y: yDevice }}
        >
          <DeviceFrame kinescopeId={kinescopeId} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}
