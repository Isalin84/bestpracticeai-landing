import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api } from '../api/client'
import type { Article } from '../types'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    api.getArticle(slug)
      .then(setArticle)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--bp-font-body)', color: '#9ca3af' }}>Загружаем...</div>
    </div>
  )

  if (error || !article) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontFamily: 'var(--bp-font-heading)', color: 'var(--bp-dark-blue)' }}>Статья не найдена</h1>
      <Link to="/" className="btn-primary">На главную</Link>
    </div>
  )

  const date = new Date(article.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  const canonical = `https://bestpracticeai.ru/blog/${article.slug}`
  const ogImage = article.cover_url || 'https://bestpracticeai.ru/assets/og/OG.jpg'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    image: ogImage,
    datePublished: new Date(article.created_at).toISOString(),
    dateModified: new Date(article.updated_at || article.created_at).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@type': 'Person', name: 'Иван Салин', url: 'https://bestpracticeai.ru' },
    publisher: {
      '@type': 'Organization',
      name: 'Best Practice AI',
      logo: { '@type': 'ImageObject', url: 'https://raw.githubusercontent.com/Isalin84/assets/main/media/LogoBP_YellowCircle.png' },
    },
  }

  return (
    <>
      <Helmet>
        <title>{`${article.title} — Best Practice AI`}</title>
        {article.excerpt && <meta name="description" content={article.excerpt} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${article.title} — Best Practice AI`} />
        {article.excerpt && <meta property="og:description" content={article.excerpt} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ paddingTop: 96, minHeight: '100vh', background: 'var(--bp-light-bg)' }}>
        {/* Breadcrumbs */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 0', display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af' }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Главная</Link>
          <span>→</span>
          <Link to="/#media" style={{ color: '#9ca3af', textDecoration: 'none' }}>Медиа</Link>
          <span>→</span>
          <span style={{ color: 'var(--bp-dark-blue)' }}>{article.title}</span>
        </div>

        <article style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 96px' }}>
          {article.cover_url && (
            <img src={article.cover_url} alt={article.title} style={{ width: '100%', borderRadius: 16, marginBottom: 40, objectFit: 'cover', maxHeight: 420 }} />
          )}

          <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>{date}</div>

          <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--bp-dark-blue)', lineHeight: 1.2, marginBottom: 24 }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{ fontFamily: 'var(--bp-font-body)', fontStyle: 'italic', fontSize: 18, color: '#6b7280', lineHeight: 1.7, marginBottom: 40, borderLeft: '4px solid var(--bp-gold)', paddingLeft: 20 }}>
              {article.excerpt}
            </p>
          )}

          <div className="prose-bp">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </>
  )
}
