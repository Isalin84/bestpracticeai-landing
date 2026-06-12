import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScrollProgress } from '../ui/ScrollProgress'
import { scrollToId } from '../../hooks/useLenis'

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
  const [hovered, setHovered] = useState<string | null>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (!isHome) return
    scrollToId(id)
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled || menuOpen ? 'rgba(11,29,58,0.85)' : 'rgba(11,29,58,0.55)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(212,175,55,0.1)',
        transition: 'background 0.3s, border-color 0.3s',
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
          <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 500, fontSize: 13, color: 'rgba(250,249,246,0.65)', letterSpacing: '0.05em' }}>
            AI Студия
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="hidden-mobile"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={e => { if (isHome && item.href.startsWith('/#')) { e.preventDefault(); scrollTo(item.href.slice(2)) } }}
              onMouseEnter={() => setHovered(item.label)}
              style={{
                position: 'relative',
                fontFamily: 'var(--bp-font-heading)',
                fontWeight: 500,
                fontSize: 14,
                color: hovered === item.label ? 'var(--bp-gold)' : 'rgba(250,249,246,0.92)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
              {hovered === item.label && (
                <motion.span
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    borderRadius: 1,
                    background: 'var(--bp-gold)',
                  }}
                />
              )}
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
            <span style={{ display: 'block', width: 24, height: 2, background: '#FAF9F6', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#FAF9F6', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#FAF9F6', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(11,29,58,0.97)',
            padding: '16px 24px 24px',
            borderTop: '1px solid rgba(212,175,55,0.15)',
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
                color: '#FAF9F6',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
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

      <ScrollProgress />

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
