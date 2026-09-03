import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../../api/client'
import type { Service, ServiceBlock, ServiceFaq, ServicePortfolioItem } from '../../types'

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.adminGetServices().then(setServices).catch(() => toast.error('Не удалось загрузить услуги'))
  }, [])

  const save = async () => {
    if (!editing) return
    if (!editing.name.trim() || !editing.title.trim() || !editing.description.trim()) {
      toast.error('Заполните название, SEO-заголовок и описание')
      return
    }
    setSaving(true)
    try {
      const updated = await api.adminUpdateService(editing.slug, editing)
      setServices(prev => prev.map(s => (s.slug === updated.slug ? updated : s)))
      setEditing(null)
      toast.success('Услуга сохранена')
    } catch (e) {
      toast.error((e as Error).message || 'Ошибка сохранения')
    }
    setSaving(false)
  }

  const togglePublished = async (s: Service) => {
    try {
      const updated = await api.adminUpdateService(s.slug, { ...s, published: !s.published })
      setServices(prev => prev.map(x => (x.slug === updated.slug ? updated : x)))
      toast.success(updated.published ? 'Опубликовано' : 'Снято с публикации')
    } catch (e) {
      toast.error((e as Error).message || 'Ошибка')
    }
  }

  if (editing) {
    return <ServiceEditor service={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)' }}>Услуги</h1>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Контент страниц услуг и карточек на главной. Изменения сразу видны на сайте и в SEO-версии для поисковиков.
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', overflow: 'hidden' }}>
        {services.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Загрузка...</div>
        ) : services.map(s => (
          <div key={s.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            {s.card_image ? (
              <img src={s.card_image} alt="" style={{ width: 42, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 42, height: 56, borderRadius: 6, background: '#f1f5f9', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--bp-dark-blue)' }}>
                <span style={{ color: 'var(--bp-gold)', marginRight: 8 }}>{s.card_num}</span>{s.name}
              </div>
              <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#9ca3af' }}>
                /services/{s.slug} · {s.blocks.length} блок(ов) · {s.faq.length} вопрос(ов)
              </div>
            </div>
            <button
              onClick={() => togglePublished(s)}
              title="Переключить публикацию"
              style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--bp-font-heading)', fontWeight: 600, border: 'none', cursor: 'pointer', background: s.published ? '#dcfce7' : '#f1f5f9', color: s.published ? '#16a34a' : '#6b7280' }}
            >
              {s.published ? 'Опубликовано' : 'Скрыто'}
            </button>
            <button onClick={() => setEditing({ ...s })} className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>Редактировать</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceEditor({ service, onChange, onSave, onCancel, saving }: {
  service: Service
  onChange: (s: Service) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const set = <K extends keyof Service>(key: K, value: Service[K]) => onChange({ ...service, [key]: value })

  // --- блоки ---
  const setBlock = (i: number, patch: Partial<ServiceBlock>) =>
    set('blocks', service.blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  const addBlock = () => set('blocks', [...service.blocks, { heading: 'Новый блок', items: [] }])
  const removeBlock = (i: number) => set('blocks', service.blocks.filter((_, idx) => idx !== i))
  const moveBlock = (i: number, dir: -1 | 1) => set('blocks', move(service.blocks, i, dir))

  // --- FAQ ---
  const setFaq = (i: number, patch: Partial<ServiceFaq>) =>
    set('faq', service.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)))
  const addFaq = () => set('faq', [...service.faq, { q: '', a: '' }])
  const removeFaq = (i: number) => set('faq', service.faq.filter((_, idx) => idx !== i))
  const moveFaq = (i: number, dir: -1 | 1) => set('faq', move(service.faq, i, dir))

  // --- портфолио ---
  const setPf = (i: number, patch: Partial<ServicePortfolioItem>) =>
    set('portfolio', service.portfolio.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  const addPf = () => set('portfolio', [...service.portfolio, { name: '', description: '', href: '' }])
  const removePf = (i: number) => set('portfolio', service.portfolio.filter((_, idx) => idx !== i))
  const movePf = (i: number, dir: -1 | 1) => set('portfolio', move(service.portfolio, i, dir))

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontFamily: 'var(--bp-font-heading)', fontSize: 13, padding: 0, marginBottom: 6 }}>← К списку услуг</button>
          <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 26, color: 'var(--bp-dark-blue)' }}>{service.name || 'Услуга'}</h1>
          <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af' }}>/services/{service.slug}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button onClick={onSave} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1, fontSize: 14, padding: '10px 22px' }}>{saving ? 'Сохраняем...' : 'Сохранить'}</button>
          <button onClick={onCancel} className="btn-secondary" style={{ fontSize: 14, padding: '8px 20px' }}>Отмена</button>
        </div>
      </div>

      <Card title="Основное">
        <Field label="Название (H1 и заголовок карточки) *">
          <input value={service.name} onChange={e => set('name', e.target.value)} style={inp} />
        </Field>
        <Field label="Подзаголовок на странице услуги">
          <textarea value={service.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} />
        </Field>
        <Field label="Короткое описание для карточки на главной">
          <input value={service.card_description} onChange={e => set('card_description', e.target.value)} style={inp} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: 14 }}>
          <Field label="Номер">
            <input value={service.card_num} onChange={e => set('card_num', e.target.value)} style={inp} />
          </Field>
          <Field label="Картинка карточки (URL)">
            <input value={service.card_image} onChange={e => set('card_image', e.target.value)} style={inp} placeholder="/assets/services/…webp" />
          </Field>
          <Field label="Порядок">
            <input type="number" value={service.sort_order} onChange={e => set('sort_order', Number(e.target.value))} style={inp} />
          </Field>
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 14, color: 'var(--bp-dark-blue)' }}>
          <input type="checkbox" checked={service.published} onChange={e => set('published', e.target.checked)} style={{ accentColor: 'var(--bp-gold)', width: 16, height: 16 }} />
          Опубликовано
        </label>
      </Card>

      <Card title="SEO">
        <Field label="Title (заголовок вкладки, ~60 символов) *">
          <input value={service.title} onChange={e => set('title', e.target.value)} style={inp} />
          <Hint>{service.title.length} символов</Hint>
        </Field>
        <Field label="Meta description (~160 символов) *">
          <textarea value={service.description} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} />
          <Hint>{service.description.length} символов</Hint>
        </Field>
      </Card>

      <Card title="Блоки контента" action={<SmallBtn onClick={addBlock}>+ Добавить блок</SmallBtn>}>
        {service.blocks.length === 0 && <Empty>Блоков пока нет</Empty>}
        {service.blocks.map((b, i) => (
          <Item key={i} index={i} total={service.blocks.length} onMove={d => moveBlock(i, d)} onRemove={() => removeBlock(i)}>
            <Field label="Заголовок блока">
              <input value={b.heading} onChange={e => setBlock(i, { heading: e.target.value })} style={inp} />
            </Field>
            <Field label="Пункты — по одному в строке">
              <textarea
                value={b.items.join('\n')}
                onChange={e => setBlock(i, { items: e.target.value.split('\n') })}
                onBlur={e => setBlock(i, { items: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                rows={Math.max(4, b.items.length + 1)}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
              />
            </Field>
          </Item>
        ))}
      </Card>

      <Card title="Вопросы и ответы (FAQ)" action={<SmallBtn onClick={addFaq}>+ Добавить вопрос</SmallBtn>}>
        {service.faq.length === 0 && <Empty>Вопросов пока нет</Empty>}
        {service.faq.map((f, i) => (
          <Item key={i} index={i} total={service.faq.length} onMove={d => moveFaq(i, d)} onRemove={() => removeFaq(i)}>
            <Field label="Вопрос">
              <input value={f.q} onChange={e => setFaq(i, { q: e.target.value })} style={inp} />
            </Field>
            <Field label="Ответ">
              <textarea value={f.a} onChange={e => setFaq(i, { a: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical' }} />
            </Field>
          </Item>
        ))}
      </Card>

      <Card title="Примеры работ (ссылки)" action={<SmallBtn onClick={addPf}>+ Добавить пример</SmallBtn>}>
        {service.portfolio.length === 0 && <Empty>Раздел не показывается, пока пуст</Empty>}
        {service.portfolio.map((p, i) => (
          <Item key={i} index={i} total={service.portfolio.length} onMove={d => movePf(i, d)} onRemove={() => removePf(i)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Название">
                <input value={p.name} onChange={e => setPf(i, { name: e.target.value })} style={inp} />
              </Field>
              <Field label="Ссылка (необязательно)">
                <input value={p.href || ''} onChange={e => setPf(i, { href: e.target.value })} style={inp} placeholder="https://…" />
              </Field>
            </div>
            <Field label="Описание">
              <input value={p.description} onChange={e => setPf(i, { description: e.target.value })} style={inp} />
            </Field>
          </Item>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 40 }}>
        <button onClick={onSave} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>{saving ? 'Сохраняем...' : 'Сохранить'}</button>
        <button onClick={onCancel} className="btn-secondary">Отмена</button>
      </div>
    </div>
  )
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const copy = [...arr]
  ;[copy[i], copy[j]] = [copy[j], copy[i]]
  return copy
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 17, color: 'var(--bp-dark-blue)', margin: 0 }}>{title}</h2>
        {action}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </section>
  )
}

function Item({ index, total, onMove, onRemove, children }: {
  index: number
  total: number
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ border: '1px solid #eef2f7', borderRadius: 12, padding: 16, background: '#fafbfc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--bp-gold)' }}>#{index + 1}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <IconBtn onClick={() => onMove(-1)} disabled={index === 0} title="Выше">↑</IconBtn>
          <IconBtn onClick={() => onMove(1)} disabled={index === total - 1} title="Ниже">↓</IconBtn>
          <IconBtn onClick={onRemove} title="Удалить" danger>✕</IconBtn>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{children}</div>
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#9ca3af', padding: '8px 0' }}>{children}</div>
}

function SmallBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>{children}</button>
  )
}

function IconBtn({ onClick, disabled, title, danger, children }: { onClick: () => void; disabled?: boolean; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: disabled ? 'default' : 'pointer', color: danger ? '#ef4444' : 'var(--bp-dark-blue)', opacity: disabled ? 0.35 : 1, fontSize: 13 }}
    >
      {children}
    </button>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontFamily: 'var(--bp-font-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fff' }
