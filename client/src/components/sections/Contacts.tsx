import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { api } from '../../api/client'
import type { LeadFormData } from '../../types'

export function Contacts() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadFormData>()
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: LeadFormData) => {
    if (data.honeypot) return // spam
    try {
      await api.submitLead({
        full_name: data.full_name,
        company: data.company,
        phone: data.phone,
        message: data.message,
      })
      setSuccess(true)
      reset()
    } catch (e: any) {
      toast.error(e.message || 'Ошибка отправки. Попробуйте ещё раз.')
    }
  }

  return (
    <section id="contacts" style={{ background: 'var(--bp-light-bg)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--bp-dark-blue)', marginBottom: 16 }}>
            Свяжитесь с нами
          </h2>
          <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 18, color: '#6b7280' }}>
            Расскажите о вашей задаче — обсудим, как можем помочь
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }} className="contacts-grid">

          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bp-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.77a16 16 0 0 0 6.29 6.29l1.85-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                  label: 'Телефон', value: '+7 (910) 170-11-26', href: 'tel:+79101701126',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bp-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                  label: 'Email', value: 'salinivan@mail.ru', href: 'mailto:salinivan@mail.ru',
                },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <div style={{ width: 48, height: 48, background: 'rgba(212,175,55,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--bp-font-heading)', fontSize: 12, color: '#9ca3af', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 600, fontSize: 16, color: 'var(--bp-dark-blue)' }}>{item.value}</div>
                  </div>
                </a>
              ))}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <a
                  href="https://t.me/bestpractice_hs_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: 14, justifyContent: 'center', flex: 1 }}
                >
                  Telegram
                </a>
                <a
                  href="https://vk.com/club224447229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: 14, justifyContent: 'center', flex: 1 }}
                >
                  ВКонтакте
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {success ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--bp-dark-blue)', marginBottom: 12 }}>
                  Заявка принята!
                </h3>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 16, color: '#6b7280', lineHeight: 1.6 }}>
                  Мы свяжемся с вами в течение 24 часов. Если хотите ускорить — напишите напрямую в Telegram: <a href="https://t.me/isalin" style={{ color: 'var(--bp-gold)' }}>@isalin</a>
                </p>
                <button onClick={() => setSuccess(false)} className="btn-primary" style={{ marginTop: 24 }}>
                  Отправить ещё
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ background: '#fff', borderRadius: 20, padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
              >
                {/* Honeypot */}
                <input {...register('honeypot')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Full name */}
                  <div>
                    <label style={labelStyle}>ФИО *</label>
                    <input
                      {...register('full_name', { required: 'Введите ваше имя' })}
                      placeholder="Иван Иванов"
                      style={{ ...inputStyle, borderColor: errors.full_name ? '#ef4444' : '#e5e7eb' }}
                    />
                    {errors.full_name && <p style={errorStyle}>{errors.full_name.message}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label style={labelStyle}>Компания</label>
                    <input
                      {...register('company')}
                      placeholder="Название вашей компании (необязательно)"
                      style={inputStyle}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Телефон *</label>
                    <input
                      {...register('phone', {
                        required: 'Введите телефон',
                        pattern: { value: /^[\d\s\+\-\(\)]{10,}$/, message: 'Некорректный номер' },
                      })}
                      placeholder="+7 (910) 170-11-26"
                      type="tel"
                      style={{ ...inputStyle, borderColor: errors.phone ? '#ef4444' : '#e5e7eb' }}
                    />
                    {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Ваш запрос *</label>
                    <textarea
                      {...register('message', { required: 'Опишите ваш запрос' })}
                      placeholder="Расскажите, что вас интересует..."
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', borderColor: errors.message ? '#ef4444' : '#e5e7eb' }}
                    />
                    {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
                  </div>

                  {/* Consent */}
                  <div>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        {...register('consent', { required: 'Необходимо согласие' })}
                        style={{ marginTop: 3, accentColor: 'var(--bp-gold)', width: 16, height: 16, flexShrink: 0 }}
                      />
                      <span style={{ fontFamily: 'var(--bp-font-body)', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                        Я соглашаюсь с{' '}
                        <a href="/privacy" style={{ color: 'var(--bp-gold)', textDecoration: 'underline' }} target="_blank">
                          Политикой обработки персональных данных
                        </a>
                      </span>
                    </label>
                    {errors.consent && <p style={errorStyle}>{errors.consent.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contacts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

import { useState } from 'react'

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--bp-font-heading)',
  fontWeight: 600,
  fontSize: 13,
  color: 'var(--bp-dark-blue)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: '1.5px solid #e5e7eb',
  fontFamily: 'var(--bp-font-body)',
  fontSize: 15,
  color: 'var(--bp-text-dark)',
  background: '#fafafa',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--bp-font-body)',
  fontSize: 12,
  color: '#ef4444',
  marginTop: 4,
}
