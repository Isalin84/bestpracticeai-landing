import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../../api/client'

const SETTINGS_CONFIG = [
  { key: 'hero_video_id', label: 'Kinescope ID для hero-видео', placeholder: 'xmACts9kgZPMEWgLG5sfys', description: 'ID видео на Kinescope.io для отображения в главном блоке' },
  { key: 'notify_email', label: 'Email для уведомлений о заявках', placeholder: 'salinivan@mail.ru', description: 'Адрес получает уведомление при каждой новой заявке' },
  { key: 'yandex_metrika_id', label: 'Яндекс.Метрика — ID счётчика', placeholder: '12345678', description: 'Загружается только после принятия cookies пользователем' },
]

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}) }, [])

  const save = async (key: string) => {
    setSaving(key)
    try {
      await api.adminUpdateSetting(key, settings[key] || '')
      toast.success('Сохранено')
    } catch {
      toast.error('Ошибка сохранения')
    }
    setSaving(null)
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)', marginBottom: 8 }}>Настройки</h1>
      <p style={{ fontFamily: 'var(--bp-font-body)', color: '#6b7280', marginBottom: 36 }}>Управление конфигурацией сайта</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SETTINGS_CONFIG.map(cfg => (
          <div key={cfg.key} style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', border: '1px solid rgba(11,29,58,0.08)' }}>
            <label style={{ display: 'block', fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--bp-dark-blue)', marginBottom: 4 }}>
              {cfg.label}
            </label>
            <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>{cfg.description}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={settings[cfg.key] || ''}
                onChange={e => setSettings(prev => ({ ...prev, [cfg.key]: e.target.value }))}
                placeholder={cfg.placeholder}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontFamily: 'var(--bp-font-body)', fontSize: 15, outline: 'none', background: '#fafafa' }}
              />
              <button
                onClick={() => save(cfg.key)}
                disabled={saving === cfg.key}
                className="btn-primary"
                style={{ whiteSpace: 'nowrap', opacity: saving === cfg.key ? 0.6 : 1 }}
              >
                {saving === cfg.key ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
