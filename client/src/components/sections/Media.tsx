import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../api/client'
import type { Article } from '../../types'

function ArticleCard({ article, delay }: { article: Article; delay: number }) {
  const date = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(11,29,58,0.08)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          {article.cover_url && (
            <img
              src={article.cover_url}
              alt={article.title}
              loading="lazy"
              style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
            />
          )}
          {!article.cover_url && (
            <div style={{ height: 200, background: 'linear-gradient(135deg, var(--bp-steel-blue), var(--bp-dark-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 32, color: 'var(--bp-gold)', opacity: 0.4 }}>BP</span>
            </div>
          )}
          <div style={{ padding: '24px 24px 28px' }}>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontSize: 12, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.05em' }}>
              {date}
            </div>
            <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 18, color: 'var(--bp-dark-blue)', lineHeight: 1.35, marginBottom: 12 }}>
              {article.title}
            </h3>
            {article.excerpt && (
              <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
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
      const res = await api.getArticles(p, 6)
      setArticles(prev => p === 1 ? res.articles : [...prev, ...res.articles])
      setHasMore(res.hasMore)
      setPage(p)
    } catch {}
    setLoading(false)
  }

  return (
    <section id="media" style={{ background: 'var(--bp-light-bg)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--bp-dark-blue)', marginBottom: 16 }}>
            Медиа
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: '#6b7280' }}>
            Статьи, кейсы и инсайты о применении ИИ в бизнесе
          </p>
        </motion.div>

        {articles.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--bp-font-body)', color: '#9ca3af' }}>
            Статьи скоро появятся
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="media-grid">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} delay={i * 0.1} />
          ))}
          {loading && [1,2,3].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', height: 340, animation: 'pulse 1.5s ease-in-out infinite alternate' }}>
              <div style={{ height: 200, background: '#f3f4f6' }} />
              <div style={{ padding: 24 }}>
                <div style={{ height: 12, background: '#f3f4f6', borderRadius: 6, width: '60%', marginBottom: 12 }} />
                <div style={{ height: 18, background: '#f3f4f6', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 14, background: '#f3f4f6', borderRadius: 6, width: '80%' }} />
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              onClick={() => loadArticles(page + 1)}
              disabled={loading}
              className="btn-secondary"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Загружаем...' : 'Загрузить ещё'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .media-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .media-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { from { opacity: 1; } to { opacity: 0.5; } }
      `}</style>
    </section>
  )
}
