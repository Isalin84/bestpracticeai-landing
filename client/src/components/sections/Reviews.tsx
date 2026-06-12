import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../api/client'
import { SectionSpotlight } from '../ui/SectionSpotlight'
import type { Review } from '../../types'

const AUTOPLAY_MS = 7000

function Monogram({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--bp-gold), var(--bp-medium-gold))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 24,
      color: 'var(--bp-dark-blue)', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: 1, name: 'Клиент A', position: 'HR-директор', company: null,
    text: 'Благодаря обучению от Ивана мы за два месяца внедрили ИИ-инструменты в работу HR-команды. Сократили время на создание обучающих материалов в три раза. Рекомендую всем, кто хочет реально использовать нейросети в работе.',
    photo_url: null, published: 1, sort_order: 0, created_at: '',
  },
  {
    id: 2, name: 'Клиент B', position: 'Руководитель по безопасности', company: null,
    text: 'Заказали серию обучающих видео с AI-аватаром для инструктажей по охране труда. Качество превзошло ожидания — сотрудники воспринимают видео намного лучше, чем стандартные PDF-инструкции. И это в разы дешевле традиционной съёмки.',
    photo_url: null, published: 1, sort_order: 1, created_at: '',
  },
  {
    id: 3, name: 'Клиент C', position: 'Предприниматель', company: null,
    text: 'Прошёл индивидуальное обучение по нейросетям. Иван объясняет сложные вещи простым языком, сразу даёт практические инструменты. За неделю занятий освоил больше, чем за месяц самостоятельного изучения.',
    photo_url: null, published: 1, sort_order: 2, created_at: '',
  },
]

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    api.getReviews()
      .then(data => setReviews(data.length > 0 ? data : PLACEHOLDER_REVIEWS))
      .catch(() => setReviews(PLACEHOLDER_REVIEWS))
  }, [])

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent(c => (c + 1) % reviews.length)

  // Автопрокрутка: таймер перезапускается при ручной навигации (current в deps)
  useEffect(() => {
    if (reviews.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % reviews.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [reviews.length, paused, current])

  if (reviews.length === 0) return null

  const review = reviews[current]

  return (
    <section id="reviews" style={{ background: 'var(--bp-dark-blue)', padding: '96px 0', position: 'relative' }}>
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
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: 16 }}>
            Что говорят клиенты
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: 'rgba(250,249,246,0.6)' }}>
            Реальные результаты — реальные люди
          </p>
        </motion.div>

        <div
          style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Decorative gold quotes */}
          <img
            src="/assets/decorative/quote-marks.svg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', top: -20, left: -20, width: 60, opacity: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              drag={reviews.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next()
                else if (info.offset.x > 80) prev()
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 20,
                padding: '48px 56px',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: reviews.length > 1 ? 'grab' : 'default',
                touchAction: 'pan-y',
              }}
              whileDrag={{ cursor: 'grabbing', scale: 0.985 }}
              className="review-card-inner"
            >
              <p style={{
                fontFamily: 'var(--bp-font-body)',
                fontStyle: 'italic',
                fontSize: 'clamp(16px,2vw,20px)',
                color: 'rgba(250,249,246,0.9)',
                lineHeight: 1.8,
                marginBottom: 36,
              }}>
                «{review.text}»
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {review.photo_url
                  ? <img src={review.photo_url} alt={review.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bp-gold)' }} draggable={false} />
                  : <Monogram name={review.name} />
                }
                <div>
                  <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 17, color: '#fff' }}>
                    {review.name}
                  </div>
                  {(review.position || review.company) && (
                    <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: 'rgba(250,249,246,0.5)', marginTop: 2 }}>
                      {[review.position, review.company].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {reviews.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
              <button
                onClick={prev}
                style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(212,175,55,0.4)', background: 'transparent', cursor: 'pointer', color: 'var(--bp-gold)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bp-gold)'; e.currentTarget.style.color = 'var(--bp-dark-blue)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bp-gold)' }}
                aria-label="Предыдущий"
              >
                ←
              </button>

              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: 'none',
                    background: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'width 0.3s',
                    padding: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  aria-label={`Отзыв ${i + 1}`}
                >
                  {i === current && (
                    <span
                      key={`progress-${current}`}
                      className="review-dot-progress"
                      style={{ animationPlayState: paused ? 'paused' : 'running' }}
                    />
                  )}
                </button>
              ))}

              <button
                onClick={next}
                style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(212,175,55,0.4)', background: 'transparent', cursor: 'pointer', color: 'var(--bp-gold)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bp-gold)'; e.currentTarget.style.color = 'var(--bp-dark-blue)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bp-gold)' }}
                aria-label="Следующий"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .review-dot-progress {
          position: absolute;
          inset: 0;
          background: var(--bp-gold);
          border-radius: 4px;
          transform-origin: left;
          animation: review-dot-fill ${AUTOPLAY_MS}ms linear forwards;
        }
        @keyframes review-dot-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .review-dot-progress { animation: none; transform: scaleX(1); }
        }
        @media (max-width: 640px) {
          .review-card-inner { padding: 32px 24px !important; }
        }
      `}</style>
    </section>
  )
}
