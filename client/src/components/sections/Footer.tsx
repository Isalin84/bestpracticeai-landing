import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bp-grain" style={{ background: 'var(--bp-dark-blue)', padding: '64px 0 32px', position: 'relative' }}>
      <div className="section-topline" aria-hidden="true" />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.3fr', gap: 40, marginBottom: 48 }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/assets/logos/LogoBP_YellowCircle.png" alt="Best Practice AI" style={{ height: 44 }} />
              <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 500, fontSize: 13, color: 'rgba(250,249,246,0.5)', letterSpacing: '0.05em' }}>
                AI Студия
              </span>
            </div>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: 'rgba(250,249,246,0.5)', lineHeight: 1.7, maxWidth: 300 }}>
              Генеративные нейросети для бизнеса и частных лиц. Экспертиза · Инновации · Результат.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="https://t.me/bestpractice_ai" target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                TG
              </a>
              <a href="https://vk.com/club224447229" target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                VK
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--bp-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Навигация
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'О нас', href: '/#about' },
                { label: 'Услуги', href: '/#services' },
                { label: 'Медиа', href: '/#media' },
                { label: 'Отзывы', href: '/#reviews' },
                { label: 'Контакты', href: '/#contacts' },
              ].map(item => (
                <a key={item.label} href={item.href} style={footerLinkStyle} className="footer-link">{item.label}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--bp-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Правовое
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/privacy" style={footerLinkStyle} className="footer-link">Политика обработки данных</Link>
              <Link to="/privacy" style={footerLinkStyle} className="footer-link">Использование cookies</Link>
            </div>
          </div>

          {/* Founder */}
          <div>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--bp-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Основатель
            </div>
            <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 4 }}>
              Иван Салин
            </div>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: 'rgba(250,249,246,0.5)', lineHeight: 1.6, margin: '0 0 14px' }}>
              Эксперт по промышленной безопасности, пионер применения генеративного ИИ в бизнесе.
            </p>
            <a
              href="https://www.salinsafety.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-founder-link"
            >
              salinsafety.ru
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 11 L11 1 M11 1 H5 M11 1 V7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: 'rgba(250,249,246,0.35)' }}>
            © 2026 Best Practice AI. Все права защищены.
          </span>
          <a href="https://bestpracticeai.ru" style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: 'rgba(250,249,246,0.35)', textDecoration: 'none' }}>
            bestpracticeai.ru
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        .footer-link:hover { color: var(--bp-gold) !important; }
        .footer-founder-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--bp-font-heading);
          font-weight: 600;
          font-size: 13px;
          color: var(--bp-gold);
          text-decoration: none;
          border: 1.5px solid rgba(212,175,55,0.45);
          border-radius: 100px;
          padding: 8px 18px;
          transition: all 0.2s;
        }
        .footer-founder-link:hover {
          background: var(--bp-gold);
          color: var(--bp-dark-blue);
          border-color: var(--bp-gold);
        }
      `}</style>
    </footer>
  )
}

const footerLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--bp-font-body)',
  fontSize: 14,
  color: 'rgba(250,249,246,0.55)',
  textDecoration: 'none',
  transition: 'color 0.2s',
}

const socialBtnStyle: React.CSSProperties = {
  width: 40, height: 40,
  borderRadius: '50%',
  border: '1.5px solid rgba(212,175,55,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 12,
  color: 'var(--bp-gold)',
  textDecoration: 'none',
  transition: 'all 0.2s',
}
