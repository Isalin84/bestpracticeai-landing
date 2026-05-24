import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { PortfolioVideo } from '../../types'

const SERVICES = [
  { value: 'corporate-ai-video', label: 'Корпоративные ИИ-видео' },
  { value: 'ai-video-training', label: 'Обучение ИИ-видео' },
  { value: 'neural-networks-training', label: 'Обучение нейросетям' },
  { value: 'vibecoding', label: 'Вайбкодинг' },
  { value: 'additional', label: 'Дополнительные услуги' },
]

const EMPTY: Partial<PortfolioVideo> = { service_slug: 'corporate-ai-video', kinescope_id: '', title: '', caption: '', aspect_ratio: '16:9', sort_order: 0, published: 1 }

export function AdminPortfolio() {
  const [videos, setVideos] = useState<PortfolioVideo[]>([])
  const [editing, setEditing] = useState<Partial<PortfolioVideo> | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewId, setPreviewId] = useState('')

  useEffect(() => { api.adminGetPortfolio().then(setVideos).catch(() => {}) }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        const updated = await api.adminUpdateVideo(editing.id, editing)
        setVideos(prev => prev.map(v => v.id === updated.id ? updated : v))
      } else {
        const created = await api.adminCreateVideo(editing)
        setVideos(prev => [created, ...prev])
      }
      setEditing(null)
    } catch {}
    setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm('Удалить видео?')) return
    await api.adminDeleteVideo(id)
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)' }}>Видео-портфолио</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>Добавить видео</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', overflow: 'hidden' }}>
        {videos.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Видео пока нет</div>
        ) : videos.map(v => (
          <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--bp-dark-blue)' }}>{v.title || v.kinescope_id}</div>
              <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#9ca3af' }}>{SERVICES.find(s => s.value === v.service_slug)?.label} · {v.aspect_ratio}</div>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--bp-font-heading)', fontWeight: 600, background: v.published ? '#dcfce7' : '#f1f5f9', color: v.published ? '#16a34a' : '#6b7280' }}>
              {v.published ? 'Вкл' : 'Выкл'}
            </span>
            <button onClick={() => setEditing({ ...v })} className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>Редактировать</button>
            <button onClick={() => del(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>✕</button>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
              {editing.id ? 'Редактировать видео' : 'Добавить видео'}
            </h2>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Услуга</label>
              <select value={editing.service_slug} onChange={e => setEditing(prev => ({ ...prev, service_slug: e.target.value }))} style={{ ...inp }}>
                {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Kinescope ID *</label>
              <input
                value={editing.kinescope_id || ''}
                onChange={e => { setEditing(prev => ({ ...prev, kinescope_id: e.target.value })); setPreviewId(e.target.value) }}
                placeholder="xmACts9kgZPMEWgLG5sfys"
                style={inp}
              />
            </div>

            {previewId && (
              <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', aspectRatio: editing.aspect_ratio === '9:16' ? '9/16' : '16/9', maxHeight: 200 }}>
                <iframe src={`https://kinescope.io/embed/${previewId}`} allow="autoplay; fullscreen;" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
              </div>
            )}

            {[
              { key: 'title', label: 'Название' },
              { key: 'caption', label: 'Подпись' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{f.label}</label>
                <input value={(editing as any)[f.key] || ''} onChange={e => setEditing(prev => ({ ...prev, [f.key]: e.target.value }))} style={inp} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Соотношение сторон</label>
                <select value={editing.aspect_ratio} onChange={e => setEditing(prev => ({ ...prev, aspect_ratio: e.target.value as any }))} style={inp}>
                  <option value="16:9">16:9 (горизонтальное)</option>
                  <option value="9:16">9:16 (вертикальное)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Порядок</label>
                <input type="number" value={editing.sort_order || 0} onChange={e => setEditing(prev => ({ ...prev, sort_order: Number(e.target.value) }))} style={inp} />
              </div>
            </div>

            <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 14, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
              <input type="checkbox" checked={!!editing.published} onChange={e => setEditing(prev => ({ ...prev, published: e.target.checked ? 1 : 0 }))} style={{ accentColor: 'var(--bp-gold)', width: 16, height: 16 }} />
              Опубликовать
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>{saving ? 'Сохраняем...' : 'Сохранить'}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontFamily: 'var(--bp-font-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fafafa' }
