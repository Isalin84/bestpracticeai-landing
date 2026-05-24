import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('bp_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('bp_cookie_consent', 'true')
    setVisible(false)
    // Yandex Metrika injected by App after consent
    window.dispatchEvent(new Event('cookie-consent-granted'))
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(11,29,58,0.97)',
        color: '#FAF9F6',
        borderRadius: 12,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        maxWidth: 680,
        width: 'calc(100% - 32px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, lineHeight: 1.5, flex: 1, margin: 0 }}>
        Мы используем файлы cookie для улучшения работы сайта и аналитики.
        Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
        <Link to="/privacy" style={{ color: 'var(--bp-gold)', textDecoration: 'underline' }}>
          политикой cookie
        </Link>
        .
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{
            background: 'var(--bp-gold)',
            color: 'var(--bp-dark-blue)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 20px',
            fontFamily: 'var(--bp-font-heading)',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Принять
        </button>
        <Link
          to="/privacy"
          style={{
            color: '#94a3b8',
            fontFamily: 'var(--bp-font-heading)',
            fontSize: 13,
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Подробнее
        </Link>
      </div>
    </div>
  )
}
