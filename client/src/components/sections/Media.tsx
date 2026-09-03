import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../api/client'
import { DragCarousel } from '../ui/DragCarousel'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import type { Article } from '../../types'

const PAGE_SIZE = 6
const MotionLink = motion.create(Link)

function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <MotionLink
      to={`/blog/${article.slug}`}
      className="blog-card"
      draggable={false}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="blog-card__media">
        {article.cover_url ? (
          <img src={article.cover_url} alt="" className="blog-card__img" loading="lazy" draggable={false} />
        ) : (
          <div className="blog-card__img blog-card__img--empty" aria-hidden="true">BP</div>
        )}
        <span className="blog-card__date">{date}</span>
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">{article.title}</h3>
        {article.excerpt && <p className="blog-card__excerpt">{article.excerpt}</p>}
        <span className="blog-card__more">
          Читать статью
          <span className="blog-card__arrow">→</span>
        </span>
      </div>
    </MotionLink>
  )
}

export function Media() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles(1)
  }, [])

  const loadArticles = async (p: number) => {
    setLoading(true)
    try {
      const res = await api.getArticles(p, PAGE_SIZE)
      setArticles(prev => p === 1 ? res.articles : [...prev, ...res.articles])
      setHasMore(res.hasMore)
      setPage(p)
    } catch {}
    setLoading(false)
  }

  return (
    <Section id="media" tone="light" backdrop={{ position: 'center 70%', strength: 0.08 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeading title="Блог" subtitle="Статьи, кейсы и инсайты о применении ИИ в бизнесе" />

        {articles.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--bp-font-body)', color: '#9ca3af' }}>
            Статьи скоро появятся
          </div>
        )}

        {/* Лента статей уходит за правый край контейнера — как карусель услуг */}
        <DragCarousel ariaLabel="Статьи блога" theme="light" gap={24} arrowsAlign="right" bleed>
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
          {loading && [1, 2, 3].map(i => (
            <div key={`skeleton-${i}`} className="blog-card blog-card--skeleton" aria-hidden="true">
              <div className="blog-card__media" style={{ background: '#eef0f3' }} />
              <div className="blog-card__body">
                <div style={{ height: 18, background: '#eef0f3', borderRadius: 6, marginBottom: 10 }} />
                <div style={{ height: 18, background: '#eef0f3', borderRadius: 6, width: '70%', marginBottom: 18 }} />
                <div style={{ height: 14, background: '#f3f4f6', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 14, background: '#f3f4f6', borderRadius: 6, width: '85%' }} />
              </div>
            </div>
          ))}
          {hasMore && !loading && (
            <button type="button" className="blog-card blog-card--more" onClick={() => loadArticles(page + 1)}>
              <span className="blog-card--more__ring" aria-hidden="true">→</span>
              <span>Ещё статьи</span>
            </button>
          )}
        </DragCarousel>
      </div>

      <style>{`
        .blog-card {
          position: relative;
          width: clamp(300px, 30vw, 400px);
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(11,29,58,0.06);
          box-shadow: var(--bp-shadow-card);
          text-decoration: none;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212,175,55,0.45);
          box-shadow: var(--bp-shadow-card-hover), 0 0 40px rgba(212,175,55,0.12);
        }
        .blog-card__media {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #eef0f3;
          flex-shrink: 0;
        }
        .blog-card__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .blog-card:hover .blog-card__img { transform: scale(1.05); }
        .blog-card__img--empty {
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--bp-steel-blue), var(--bp-dark-blue));
          font-family: var(--bp-font-heading); font-weight: 700; font-size: 32px;
          color: var(--bp-gold); opacity: 0.6;
        }
        .blog-card__date {
          position: absolute;
          top: 14px; left: 14px;
          padding: 6px 11px;
          border-radius: 100px;
          background: rgba(var(--bp-dark-blue-rgb), 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: rgba(250,249,246,0.9);
          font-family: var(--bp-font-heading);
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
        }
        .blog-card__body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 22px 24px 24px;
        }
        .blog-card__title {
          font-family: var(--bp-font-heading);
          font-weight: 600;
          font-size: 18px;
          line-height: 1.35;
          color: var(--bp-dark-blue);
          margin: 0 0 12px;
        }
        .blog-card__excerpt {
          font-family: var(--bp-font-body);
          font-size: 14.5px;
          line-height: 1.6;
          color: #6b7280;
          margin: 0 0 18px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card__more {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(212,175,55,0.25);
          display: flex; align-items: center; gap: 6px;
          font-family: var(--bp-font-heading);
          font-weight: 600;
          font-size: 13px;
          color: var(--bp-gold);
        }
        .blog-card__arrow { transition: transform 0.2s ease; }
        .blog-card:hover .blog-card__arrow { transform: translateX(4px); }

        .blog-card--skeleton { animation: blog-pulse 1.5s ease-in-out infinite alternate; pointer-events: none; }
        @keyframes blog-pulse { from { opacity: 1; } to { opacity: 0.55; } }

        .blog-card--more {
          align-items: center;
          justify-content: center;
          gap: 18px;
          background: transparent;
          border: 1px dashed rgba(212,175,55,0.5);
          box-shadow: none;
          cursor: pointer;
          font-family: var(--bp-font-heading);
          font-weight: 600;
          font-size: 16px;
          color: var(--bp-dark-blue);
        }
        .blog-card--more:hover { background: rgba(212,175,55,0.06); box-shadow: none; }
        .blog-card--more__ring {
          width: 56px; height: 56px; border-radius: 50%;
          border: 2px solid rgba(212,175,55,0.5);
          display: flex; align-items: center; justify-content: center;
          color: var(--bp-gold); font-size: 22px;
          transition: all 0.2s;
        }
        .blog-card--more:hover .blog-card--more__ring { background: var(--bp-gold); border-color: var(--bp-gold); color: var(--bp-dark-blue); }
      `}</style>
    </Section>
  )
}
