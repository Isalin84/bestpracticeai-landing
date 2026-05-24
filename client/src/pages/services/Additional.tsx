import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ServiceLayout } from './ServiceLayout'

const SERVICES = [
  {
    icon: '/assets/icons/icon-additional.png',
    title: 'Создание брендбука',
    text: 'Разработка визуальной идентичности с помощью ИИ-инструментов. Логотип, цветовая палитра, типографика, правила применения — всё в едином фирменном стиле.',
  },
  {
    icon: '/assets/icons/нейросеть.png',
    title: 'Нейрофотосессии',
    text: 'Профессиональные AI-портреты и корпоративные фото без фотостудии. Ваши реальные фотографии + генеративный ИИ = премиальный визуальный контент.',
  },
  {
    icon: '/assets/icons/training.png',
    title: 'Генерация музыки',
    text: 'Создание уникальных музыкальных треков для видео, презентаций и брендинга с помощью ИИ-композиторов.',
  },
  {
    icon: '/assets/icons/icon-corporate-video.png',
    title: 'Персональный видеоаватар',
    text: 'Создание вашего персонального AI-аватара для видеороликов. Один раз — используете бесконечно.',
  },
]

export function Additional() {
  return (
    <>
      <Helmet>
        <title>Дополнительные услуги — Best Practice AI</title>
      </Helmet>
      <ServiceLayout
        slug="additional"
        heroTitle="Дополнительные услуги Best Practice AI"
        heroSubtitle="Полный спектр AI-решений для вашего бренда и коммуникаций."
        ctaLabel="Узнать стоимость"
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="additional-grid">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', border: '1px solid rgba(11,29,58,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, background: 'rgba(212,175,55,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={service.icon} alt={service.title} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--bp-dark-blue)', lineHeight: 1.2 }}>
                    {service.title}
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                  {service.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </ServiceLayout>
      <style>{`@media (max-width: 768px) { .additional-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
