import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { api } from '../../api/client'

const NAV = [
  { to: '/admin/dashboard', label: 'Дашборд', icon: 'dash' },
  { to: '/admin/leads', label: 'Заявки', icon: 'leads' },
  { to: '/admin/articles', label: 'Статьи', icon: 'articles' },
  { to: '/admin/reviews', label: 'Отзывы', icon: 'reviews' },
  { to: '/admin/portfolio', label: 'Видео', icon: 'video' },
  { to: '/admin/settings', label: 'Настройки', icon: 'settings' },
]

const NAV_ICONS: Record<string, React.ReactNode> = {
  dash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  leads: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  articles: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  reviews: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  video: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

export function AdminLayout() {
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.me()
      .then(() => setChecking(false))
      .catch(() => navigate('/admin/login'))
  }, [navigate])

  const logout = async () => {
    await api.logout().catch(() => {})
    navigate('/admin/login')
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', background: 'var(--bp-dark-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--bp-gold)', fontFamily: 'var(--bp-font-heading)' }}>Загрузка...</div>
    </div>
  )

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

        {/* Sidebar */}
        <aside style={{ width: 240, background: 'var(--bp-dark-blue)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/assets/logos/LogoBP_YellowCircle.png" alt="BP" style={{ height: 36 }} />
              <div>
                <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 13, color: '#fff' }}>Best Practice</div>
                <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 11, color: 'rgba(250,249,246,0.4)' }}>Admin Panel</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '12px 8px' }}>
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ marginBottom: 2 }}
              >
                <span style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{NAV_ICONS[item.icon]}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={logout}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', color: 'rgba(250,249,246,0.4)', fontFamily: 'var(--bp-font-heading)', fontSize: 14, borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,249,246,0.4)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Выйти
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, marginLeft: 240, padding: '32px 40px', minHeight: '100vh' }}>
          <Outlet />
        </main>
      </div>
    </>
  )
}
