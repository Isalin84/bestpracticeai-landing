import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import { ServiceLayout, ContentBlock } from './ServiceLayout'
import { api } from '../../api/client'
import type { PortfolioVideo } from '../../types'

function VideoCard({ video }: { video: PortfolioVideo }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const aspect = video.aspect_ratio === '9:16' ? '9/16' : '16/9'

  return (
    <div ref={ref} style={{ borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      {inView ? (
        <iframe
          src={`https://kinescope.io/embed/${video.kinescope_id}`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
          allowFullScreen
          style={{ width: '100%', aspectRatio: aspect, border: 'none', display: 'block' }}
          title={video.title || 'Видео портфолио'}
        />
      ) : (
        <div style={{ width: '100%', aspectRatio: aspect, background: 'var(--bp-steel-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--bp-gold)', fontFamily: 'var(--bp-font-heading)', fontSize: 12 }}>Загрузка...</span>
        </div>
      )}
      {video.caption && (
        <div style={{ padding: '12px 16px', background: '#fff', fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#6b7280' }}>
          {video.caption}
        </div>
      )}
    </div>
  )
}

export function CorporateAiVideo() {
  const [videos, setVideos] = useState<PortfolioVideo[]>([])
  const [tab, setTab] = useState<'16:9' | '9:16' | 'all'>('all')

  useEffect(() => {
    api.getPortfolio('corporate-ai-video').then(setVideos).catch(() => {})
  }, [])

  const filtered = tab === 'all' ? videos : videos.filter(v => v.aspect_ratio === tab)

  return (
    <>
      <Helmet>
        <title>Корпоративные ИИ-видео с кастомными аватарами — Best Practice AI</title>
        <meta name="description" content="Создаём обучающие видео, инструктажи и промо-ролики с AI-аватарами. Быстро, качественно, с экономией до 70%." />
      </Helmet>
      <ServiceLayout
        slug="corporate-ai-video"
        heroTitle="Корпоративные ИИ-видео с кастомными аватарами"
        heroSubtitle="Создаём профессиональные видеоматериалы с персональным AI-аватаром вашего эксперта — быстро, качественно, с экономией до 70% бюджета."
        ctaLabel="Обсудить проект"
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }} className="service-detail-grid">
            <div>
              <ContentBlock
                title="Что мы создаём"
                items={[
                  'Обучающие видео и курсы (для LMS-платформ)',
                  'Видеоинструктажи и инструкции по охране труда',
                  'Онбординг-видео для новых сотрудников',
                  'Коммуникационные ролики для внутренних коммуникаций',
                  'Промо и маркетинговые видео с AI-ведущим',
                  'Видео для социальных сетей (форматы 16:9 и 9:16)',
                ]}
              />
            </div>
            <div>
              <ContentBlock
                title="Как это работает"
                items={[
                  'Вы предоставляете материалы и сценарий (или мы помогаем написать)',
                  'Мы создаём или используем ваш кастомный AI-аватар',
                  'Записываем профессиональный видеоряд с озвучкой',
                  'Добавляем брендинг, субтитры и спецэффекты',
                  'Вы получаете готовый ролик',
                ]}
              />
            </div>
          </div>

          {/* Portfolio */}
          {videos.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
                Видео-портфолио
              </h2>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                {[['all', 'Все'], ['16:9', '16:9'], ['9:16', '9:16 (вертикальные)']] .map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setTab(val as any)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 100,
                      border: '1.5px solid',
                      borderColor: tab === val ? 'var(--bp-gold)' : '#e5e7eb',
                      background: tab === val ? 'var(--bp-gold)' : 'transparent',
                      color: tab === val ? 'var(--bp-dark-blue)' : '#6b7280',
                      fontFamily: 'var(--bp-font-heading)',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {filtered.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ServiceLayout>

      <style>{`
        @media (max-width: 768px) { .service-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
