import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export function NotFound() {
  return (
    <>
      <Helmet><title>Страница не найдена — Best Practice AI</title></Helmet>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
        background: 'var(--bp-light-bg)',
        textAlign: 'center',
        padding: '0 24px',
      }}>
        <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 96, color: 'var(--bp-gold)', lineHeight: 1, opacity: 0.3 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 32, color: 'var(--bp-dark-blue)' }}>
          Страница не найдена
        </h1>
        <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: '#6b7280', maxWidth: 420 }}>
          Возможно, она переехала или её никогда не существовало. Но точно что-то интересное есть на главной.
        </p>
        <Link to="/" className="btn-primary">На главную</Link>
      </div>
    </>
  )
}
