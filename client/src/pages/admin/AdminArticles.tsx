import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Article } from '../../types'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9а-яё\s]/gi, '').replace(/[\s]+/g, '-').replace(/[а-яё]/gi, c => ({ а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'j',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' }[c.toLowerCase()] || c))
}

const EMPTY: Partial<Article> = { title: '', slug: '', excerpt: '', content: '', cover_url: '', published: 0 }

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editing, setEditing] = useState<Partial<Article> | null>(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => { api.adminGetArticles().then(setArticles).catch(() => {}) }, [])

  const openNew = () => setEditing({ ...EMPTY })
  const openEdit = (a: Article) => setEditing({ ...a })

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        const updated = await api.adminUpdateArticle(editing.id, editing)
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a))
      } else {
        const created = await api.adminCreateArticle(editing)
        setArticles(prev => [created, ...prev])
      }
      setEditing(null)
    } catch {}
    setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm('Удалить статью?')) return
    await api.adminDeleteArticle(id)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)' }}>Статьи</h1>
        <button onClick={openNew} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>Новая статья</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', overflow: 'hidden' }}>
        {articles.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Статей пока нет</div>
        ) : articles.map(article => (
          <div
            key={article.id}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--bp-dark-blue)', marginBottom: 2 }}>{article.title}</div>
              <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#9ca3af' }}>/blog/{article.slug}</div>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--bp-font-heading)', fontWeight: 600, background: article.published ? '#dcfce7' : '#f1f5f9', color: article.published ? '#16a34a' : '#6b7280' }}>
              {article.published ? 'Опубликовано' : 'Черновик'}
            </span>
            <button onClick={() => openEdit(article)} className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>Редактировать</button>
            <button onClick={() => del(article.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: '6px' }}>✕</button>
          </div>
        ))}
      </div>

      {/* Editor */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }} onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 900, boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
              {editing.id ? 'Редактировать статью' : 'Новая статья'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Заголовок</label>
                <input
                  value={editing.title || ''}
                  onChange={e => setEditing(prev => ({ ...prev, title: e.target.value, slug: prev?.slug || slugify(e.target.value) }))}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Slug (URL)</label>
                <input value={editing.slug || ''} onChange={e => setEditing(prev => ({ ...prev, slug: e.target.value }))} style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Превью (excerpt)</label>
              <input value={editing.excerpt || ''} onChange={e => setEditing(prev => ({ ...prev, excerpt: e.target.value }))} style={inp} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>URL обложки</label>
              <input value={editing.cover_url || ''} onChange={e => setEditing(prev => ({ ...prev, cover_url: e.target.value }))} style={inp} placeholder="https://..." />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={lbl}>Контент (Markdown)</label>
                <button onClick={() => setPreview(!preview)} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--bp-font-heading)' }}>
                  {preview ? 'Редактор' : 'Preview'}
                </button>
              </div>
              {preview ? (
                <div className="prose-bp" style={{ minHeight: 300, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fafafa' }}>
                  {editing.content || <em style={{ color: '#9ca3af' }}>Нет контента</em>}
                </div>
              ) : (
                <textarea
                  value={editing.content || ''}
                  onChange={e => setEditing(prev => ({ ...prev, content: e.target.value }))}
                  style={{ ...inp, minHeight: 300, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
                />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 14, color: 'var(--bp-dark-blue)' }}>
                <input
                  type="checkbox"
                  checked={!!editing.published}
                  onChange={e => setEditing(prev => ({ ...prev, published: e.target.checked ? 1 : 0 }))}
                  style={{ accentColor: 'var(--bp-gold)', width: 16, height: 16 }}
                />
                Опубликовать
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </button>
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
