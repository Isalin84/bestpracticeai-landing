import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { api } from '../../api/client'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.login(password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError('Неверный пароль')
    }
    setLoading(false)
  }

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div style={{ minHeight: '100vh', background: 'var(--bp-dark-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 48, width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/assets/logos/LogoBP_YellowCircle.png" alt="Best Practice AI" style={{ height: 52, marginBottom: 12 }} />
            <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', margin: 0 }}>
              Панель администратора
            </h1>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль администратора"
                autoFocus
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`, fontFamily: 'var(--bp-font-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
              {error && <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#ef4444', marginTop: 4 }}>{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: loading || !password ? 0.6 : 1 }}
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
