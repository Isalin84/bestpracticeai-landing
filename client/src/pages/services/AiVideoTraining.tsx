import { Helmet } from 'react-helmet-async'
import { ServiceLayout, ContentBlock } from './ServiceLayout'

export function AiVideoTraining() {
  return (
    <>
      <Helmet>
        <title>Обучение созданию ИИ-видео роликов — Best Practice AI</title>
      </Helmet>
      <ServiceLayout
        slug="ai-video-training"
        heroTitle="Обучение созданию ИИ-видео роликов с кастомными ведущими"
        heroSubtitle="Научитесь самостоятельно создавать профессиональные видеоролики с AI-аватарами — от идеи до готового продукта."
        ctaLabel="Записаться на обучение"
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="service-detail-grid">
            <div>
              <ContentBlock
                title="Программа обучения"
                items={[
                  'Создание базы знаний из ваших материалов',
                  'Написание сценариев с помощью ИИ',
                  'Создание и настройка кастомного AI-аватара',
                  'Генерация уникальной музыки под ваш контент',
                  'Монтаж и добавление спецэффектов через ИИ-инструменты',
                  'Публикация и продвижение готового контента',
                ]}
              />
              <ContentBlock
                title="Форматы"
                items={[
                  'Групповой воркшоп (от 5 человек)',
                  'Индивидуальный интенсив',
                  'Онлайн и офлайн',
                ]}
              />
            </div>
            <div>
              <ContentBlock
                title="Для кого"
                items={[
                  'HR и L&D специалисты',
                  'Маркетологи и контент-мейкеры',
                  'Руководители, создающие обучающие материалы',
                  'Все, кто хочет производить видеоконтент без дорогих съёмочных команд',
                ]}
              />
              <div style={{ background: 'linear-gradient(135deg, rgba(11,29,58,0.04), rgba(212,175,55,0.08))', borderRadius: 16, padding: 28, border: '1px solid rgba(212,175,55,0.2)' }}>
                <h4 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--bp-dark-blue)', marginBottom: 12 }}>
                  Что вы получите в итоге
                </h4>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                  Готовый видеоролик с AI-аватаром, созданный лично вами в ходе обучения. Навыки и инструменты для самостоятельного производства видеоконтента.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ServiceLayout>
      <style>{`@media (max-width: 768px) { .service-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
