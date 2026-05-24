import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'О нас', href: '/#about' },
  { label: 'Услуги', href: '/#services' },
  { label: 'Медиа', href: '/#media' },
  { label: 'Отзывы', href: '/#reviews' },
  { label: 'Контакты', href: '/#contacts' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (!isHome) return
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled || menuOpen ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(11,29,58,0.1)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logos/LogoBP_YellowCircle.png" alt="Best Practice AI" style={{ height: 44 }} />
          <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 500, fontSize: 13, color: '#6b7280', letterSpacing: '0.05em' }}>
            AI Студия
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={e => { if (isHome && item.href.startsWith('/#')) { e.preventDefault(); scrollTo(item.href.slice(2)) } }}
              style={{
                fontFamily: 'var(--bp-font-heading)',
                fontWeight: 500,
                fontSize: 14,
                color: 'var(--bp-dark-blue)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bp-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--bp-dark-blue)')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA + Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a
            href="/#contacts"
            onClick={e => { if (isHome) { e.preventDefault(); scrollTo('contacts') } }}
            className="btn-primary hidden-mobile"
            style={{ padding: '10px 24px', fontSize: 14 }}
          >
            Оставить заявку
          </a>
          {/* Burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
            aria-label="Меню"
          >
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--bp-dark-blue)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--bp-dark-blue)', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--bp-dark-blue)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: '#fff',
            padding: '16px 24px 24px',
            borderTop: '1px solid rgba(11,29,58,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={e => { if (isHome && item.href.startsWith('/#')) { e.preventDefault(); scrollTo(item.href.slice(2)) } else setMenuOpen(false) }}
              style={{
                fontFamily: 'var(--bp-font-heading)',
                fontWeight: 500,
                fontSize: 16,
                color: 'var(--bp-dark-blue)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(11,29,58,0.06)',
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contacts"
            onClick={e => { if (isHome) { e.preventDefault(); scrollTo('contacts') } else setMenuOpen(false) }}
            className="btn-primary"
            style={{ marginTop: 16, textAlign: 'center', justifyContent: 'center' }}
          >
            Оставить заявку
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
