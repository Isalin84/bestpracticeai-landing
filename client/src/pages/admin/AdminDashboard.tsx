import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

export function AdminDashboard() {
  const [stats, setStats] = useState({ newLeads: 0, articles: 0, reviews: 0 })

  useEffect(() => {
    Promise.all([
      api.adminGetLeads(),
      api.adminGetArticles(),
      api.adminGetReviews(),
    ]).then(([leads, articles, reviews]) => {
      setStats({
        newLeads: leads.filter(l => l.status === 'new').length,
        articles: articles.length,
        reviews: reviews.length,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Новых заявок', value: stats.newLeads, to: '/admin/leads', color: '#ef4444', bg: '#fef2f2' },
    { label: 'Статей', value: stats.articles, to: '/admin/articles', color: 'var(--bp-gold)', bg: 'rgba(212,175,55,0.1)' },
    { label: 'Отзывов', value: stats.reviews, to: '/admin/reviews', color: 'var(--bp-steel-blue)', bg: 'rgba(30,58,95,0.08)' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 8 }}>
        Дашборд
      </h1>
      <p style={{ fontFamily: 'var(--bp-font-body)', color: '#6b7280', marginBottom: 36 }}>
        Добро пожаловать в панель управления Best Practice AI
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
        {cards.map(card => (
          <Link
            key={card.label}
            to={card.to}
            style={{ textDecoration: 'none', background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(11,29,58,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontSize: 48, fontWeight: 700, color: card.color, lineHeight: 1, marginBottom: 8 }}>
              {card.value}
            </div>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 15, color: '#374151' }}>
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(11,29,58,0.08)' }}>
        <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--bp-dark-blue)', marginBottom: 16 }}>
          Быстрые действия
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/admin/articles" className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>
            Новая статья
          </Link>
          <Link to="/admin/reviews" className="btn-secondary" style={{ fontSize: 14, padding: '8px 20px' }}>
            Добавить отзыв
          </Link>
          <Link to="/admin/portfolio" className="btn-secondary" style={{ fontSize: 14, padding: '8px 20px' }}>
            Добавить видео
          </Link>
        </div>
      </div>
    </div>
  )
}
