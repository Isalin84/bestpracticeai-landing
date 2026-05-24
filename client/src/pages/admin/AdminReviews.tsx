import { useEffect, useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { api } from '../../api/client'
import type { Review } from '../../types'

const EMPTY: Partial<Review> = { name: '', position: '', company: '', text: '', photo_url: '', published: 1 }

function SortableReview({ review, onEdit, onDelete }: { review: Review; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: review.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}
    >
      <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#9ca3af', fontSize: 18, userSelect: 'none' }}>⠿</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--bp-dark-blue)' }}>{review.name}</div>
        <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af' }}>{review.position} {review.company && `· ${review.company}`}</div>
      </div>
      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--bp-font-heading)', fontWeight: 600, background: review.published ? '#dcfce7' : '#f1f5f9', color: review.published ? '#16a34a' : '#6b7280' }}>
        {review.published ? 'Вкл' : 'Выкл'}
      </span>
      <button onClick={onEdit} className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>Редактировать</button>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>✕</button>
    </div>
  )
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editing, setEditing] = useState<Partial<Review> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.adminGetReviews().then(setReviews).catch(() => {}) }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = reviews.findIndex(r => r.id === active.id)
    const newIndex = reviews.findIndex(r => r.id === over.id)
    const reordered = arrayMove(reviews, oldIndex, newIndex)
    setReviews(reordered)
    await Promise.all(reordered.map((r, i) => api.adminUpdateReview(r.id, { sort_order: i })))
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        const updated = await api.adminUpdateReview(editing.id, editing)
        setReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
      } else {
        const created = await api.adminCreateReview({ ...editing, sort_order: reviews.length })
        setReviews(prev => [...prev, created])
      }
      setEditing(null)
    } catch {}
    setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return
    await api.adminDeleteReview(id)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)' }}>Отзывы</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>Добавить отзыв</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#9ca3af' }}>
          Перетащите для изменения порядка
        </div>
        {reviews.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Отзывов пока нет</div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={reviews.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {reviews.map(r => (
                <SortableReview key={r.id} review={r} onEdit={() => setEditing({ ...r })} onDelete={() => del(r.id)} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', marginBottom: 24 }}>
              {editing.id ? 'Редактировать отзыв' : 'Новый отзыв'}
            </h2>
            {[
              { key: 'name', label: 'ФИО *', required: true },
              { key: 'position', label: 'Должность', required: false },
              { key: 'company', label: 'Компания', required: false },
              { key: 'photo_url', label: 'URL фото', required: false },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{field.label}</label>
                <input value={(editing as any)[field.key] || ''} onChange={e => setEditing(prev => ({ ...prev, [field.key]: e.target.value }))} style={inp} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Текст отзыва *</label>
              <textarea value={editing.text || ''} onChange={e => setEditing(prev => ({ ...prev, text: e.target.value }))} rows={4} style={{ ...inp, resize: 'vertical' }} />
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
