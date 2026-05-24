import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Lead } from '../../types'

const STATUS_LABELS = { new: 'Новая', in_progress: 'В работе', done: 'Завершена' }
const STATUS_COLORS = { new: '#ef4444', in_progress: '#f59e0b', done: '#22c55e' }

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.adminGetLeads().then(setLeads).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: number, status: Lead['status']) => {
    const updated = await api.adminUpdateLead(id, { status })
    setLeads(prev => prev.map(l => l.id === id ? updated : l))
    if (selected?.id === id) setSelected(updated)
  }

  const exportCsv = () => {
    const header = 'ID,ФИО,Компания,Телефон,Запрос,Статус,Дата'
    const rows = leads.map(l =>
      [l.id, `"${l.full_name}"`, `"${l.company || ''}"`, l.phone, `"${(l.message || '').replace(/"/g, '""')}"`, STATUS_LABELS[l.status], l.created_at].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--bp-dark-blue)' }}>Заявки</h1>
        <button onClick={exportCsv} className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
          Экспорт CSV
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,29,58,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Загружаем...</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--bp-font-body)' }}>Заявок пока нет</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['ФИО', 'Компания', 'Телефон', 'Дата', 'Статус', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, color: '#6b7280', textAlign: 'left', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => setSelected(lead)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 14, color: 'var(--bp-dark-blue)' }}>{lead.full_name}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--bp-font-body)', fontSize: 14, color: '#6b7280' }}>{lead.company || '—'}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--bp-font-body)', fontSize: 14 }}><a href={`tel:${lead.phone}`} style={{ color: 'var(--bp-dark-blue)', textDecoration: 'none' }}>{lead.phone}</a></td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#9ca3af' }}>{new Date(lead.created_at).toLocaleDateString('ru-RU')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 12, fontFamily: 'var(--bp-font-heading)', fontWeight: 600, background: `${STATUS_COLORS[lead.status]}15`, color: STATUS_COLORS[lead.status] }}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={lead.status}
                      onChange={e => { e.stopPropagation(); updateStatus(lead.id, e.target.value as Lead['status']) }}
                      onClick={e => e.stopPropagation()}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', fontFamily: 'var(--bp-font-body)', fontSize: 13, cursor: 'pointer' }}
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="done">Завершена</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--bp-dark-blue)', marginBottom: 20 }}>{selected.full_name}</h2>
            {[
              ['Компания', selected.company || '—'],
              ['Телефон', selected.phone],
              ['Дата', new Date(selected.created_at).toLocaleString('ru-RU')],
              ['Запрос', selected.message || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#374151' }}>{value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {(['new', 'in_progress', 'done'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `2px solid ${selected.status === s ? STATUS_COLORS[s] : '#e5e7eb'}`, background: selected.status === s ? `${STATUS_COLORS[s]}15` : 'transparent', color: selected.status === s ? STATUS_COLORS[s] : '#6b7280', fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="btn-secondary" style={{ width: '100%', marginTop: 12, justifyContent: 'center', fontSize: 14 }}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
