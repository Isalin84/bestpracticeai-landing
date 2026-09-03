import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { DeviceFrame } from '../ui/DeviceFrame'
import { HeroScrubVideo, getHeroVideoMode } from '../ui/HeroScrubVideo'
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
  // Режим фиксируется на маунте: скраб (desktop) / луп (mobile) / постер (reduced motion)
  const [videoMode] = useState(getHeroVideoMode)
  const isScrub = videoMode === 'scrub'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Контент мягко гаснет в конце скраб-дистанции, перед «отлипанием»
  const contentOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0.35])
  const [hintHidden, setHintHidden] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', v => setHintHidden(v > 0.08))

  const scrollToContacts = () => scrollToId('contacts')
  const scrollToServices = () => scrollToId('services')

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative',
        // Дистанция скролла для полного проигрывания видео в обе стороны
        height: isScrub ? '250vh' : 'auto',
        background: 'var(--bp-dark-blue)',
      }}
    >
      <div
        className="bp-grain"
        style={{
          position: isScrub ? 'sticky' : 'relative',
          top: 0,
          height: isScrub ? '100svh' : 'auto',
          minHeight: isScrub ? 640 : '100svh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 72,
          boxSizing: 'border-box',
        }}
      >
        {/* Фоновое видео */}
        <HeroScrubVideo mode={videoMode} progress={scrollYProgress} />

        {/* Затемнение: слева под текст + виньетка снизу */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(90deg, rgba(11,29,58,0.86) 0%, rgba(11,29,58,0.55) 52%, rgba(11,29,58,0.3) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(11,29,58,0.45) 0%, rgba(11,29,58,0) 30%, rgba(11,29,58,0) 62%, rgba(11,29,58,0.72) 100%)',
          }}
        />

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
            position: 'relative',
            zIndex: 1,
          }}
          className="hero-grid"
        >
          {/* Left column */}
          {/* Внешний слой — появление, внутренний — затухание по скроллу (нельзя смешивать на одном элементе) */}
          <motion.div style={{ opacity: contentOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(11,29,58,0.5)',
                border: '1px solid rgba(212,175,55,0.45)',
                borderRadius: 100,
                padding: '6px 16px',
                marginBottom: 28,
                backdropFilter: 'blur(6px)',
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
                textShadow: '0 2px 24px rgba(11,29,58,0.6)',
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
                color: 'rgba(250,249,246,0.85)',
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 520,
                textShadow: '0 1px 12px rgba(11,29,58,0.7)',
              }}
            >
              Создаём корпоративные ИИ-видео, обучаем работе с нейросетями и разрабатываем цифровые продукты.
              Экспертиза × Инновации × Результат.
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
                  <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: 'rgba(250,249,246,0.7)' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <DeviceFrame kinescopeId={kinescopeId} />
          </motion.div>
        </div>

        {/* Подсказка скролла (только в скраб-режиме) */}
        {isScrub && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              zIndex: 1,
              opacity: hintHidden ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--bp-font-heading)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,249,246,0.6)' }}>
              Листайте
            </span>
            <div className="hero-scroll-line" />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        .hero-scroll-line {
          width: 1px;
          height: 44px;
          background: linear-gradient(180deg, var(--bp-gold), transparent);
          animation: hero-scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes hero-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.6); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }
      `}</style>
    </section>
  )
}
