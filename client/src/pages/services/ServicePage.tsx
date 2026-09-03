import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ServiceLayout, ContentBlock } from './ServiceLayout'
import { NotFound } from '../NotFound'
import { api } from '../../api/client'
import type { PortfolioVideo, Service } from '../../types'

const KNOWN_SLUGS = ['corporate-ai-video', 'ai-video-training', 'neural-networks-training', 'vibecoding', 'additional']
const CTA_BY_SLUG: Record<string, string> = {
  'corporate-ai-video': 'Обсудить проект',
  'vibecoding': 'Обсудить проект',
  'ai-video-training': 'Записаться на обучение',
  'neural-networks-training': 'Записаться на обучение',
}

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

function VideoPortfolio({ videos }: { videos: PortfolioVideo[] }) {
  const [tab, setTab] = useState<'16:9' | '9:16' | 'all'>('all')
  const hasBoth = videos.some(v => v.aspect_ratio === '16:9') && videos.some(v => v.aspect_ratio === '9:16')
  const filtered = tab === 'all' ? videos : videos.filter(v => v.aspect_ratio === tab)

  return (
    <div style={{ marginBottom: 64 }}>
      <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
        Видео-портфолио
      </h2>
      {hasBoth && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {([['all', 'Все'], ['16:9', '16:9'], ['9:16', '9:16 (вертикальные)']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
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
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {filtered.map(video => <VideoCard key={video.id} video={video} />)}
      </div>
    </div>
  )
}

function PortfolioLinks({ items }: { items: Service['portfolio'] }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
        Примеры наших работ
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="portfolio-grid">
        {items.map(item => {
          const isLink = !!item.href && item.href !== '#'
          const cardStyle: React.CSSProperties = {
            background: '#fff',
            borderRadius: 16,
            padding: '28px 24px',
            border: '1px solid rgba(11,29,58,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            display: 'block',
            transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
            ...(isLink ? { cursor: 'pointer' } : {}),
          }
          const inner = (
            <>
              <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--bp-gold)', marginBottom: 8 }}>
                {item.name}
              </h3>
              <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px' }}>
                {item.description}
              </p>
              {isLink && (
                <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 13, color: 'var(--bp-dark-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Открыть
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 11 L11 1 M11 1 H5 M11 1 V7" />
                  </svg>
                </span>
              )}
            </>
          )
          const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.borderColor = 'var(--bp-gold)'
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,175,55,0.18)'
            e.currentTarget.style.transform = 'translateY(-3px)'
          }
          const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.borderColor = 'rgba(11,29,58,0.08)'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
            e.currentTarget.style.transform = 'none'
          }
          return isLink ? (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" style={cardStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              {inner}
            </a>
          ) : (
            <div key={item.name} style={cardStyle}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}

export function ServicePage() {
  const { slug = '' } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound' | 'error'>('loading')
  const [videos, setVideos] = useState<PortfolioVideo[]>([])

  useEffect(() => {
    if (!KNOWN_SLUGS.includes(slug)) {
      setStatus('notfound')
      return
    }
    setStatus('loading')
    setService(null)
    api.getService(slug)
      .then(s => { setService(s); setStatus('ok') })
      .catch(err => setStatus(/not found/i.test(String(err?.message)) ? 'notfound' : 'error'))
    api.getPortfolio(slug).then(setVideos).catch(() => setVideos([]))
    window.scrollTo(0, 0)
  }, [slug])

  if (status === 'notfound') return <NotFound />

  if (status !== 'ok' || !service) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bp-light-bg)', paddingTop: 72 }}>
        <div style={{ fontFamily: 'var(--bp-font-body)', color: '#9ca3af', textAlign: 'center' }}>
          {status === 'error' ? (
            <>
              Не удалось загрузить страницу.{' '}
              <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: 'var(--bp-gold)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}>
                Повторить
              </button>
            </>
          ) : 'Загружаем...'}
        </div>
      </div>
    )
  }

  const [firstBlock, ...restBlocks] = service.blocks

  return (
    <>
      <ServiceLayout
        slug={service.slug}
        name={service.name}
        seoTitle={service.title}
        seoDescription={service.description}
        heroSubtitle={service.hero_subtitle || service.description}
        ctaLabel={CTA_BY_SLUG[service.slug]}
        faq={service.faq}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          {service.blocks.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: service.blocks.length > 1 ? '1fr 1fr' : '1fr', gap: 48, marginBottom: 48 }} className="service-detail-grid">
              <div>
                {firstBlock && <ContentBlock title={firstBlock.heading} items={firstBlock.items} />}
              </div>
              {restBlocks.length > 0 && (
                <div>
                  {restBlocks.map((b, i) => <ContentBlock key={i} title={b.heading} items={b.items} />)}
                </div>
              )}
            </div>
          )}

          {videos.length > 0 && <VideoPortfolio videos={videos} />}
          {service.portfolio.length > 0 && <PortfolioLinks items={service.portfolio} />}
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
