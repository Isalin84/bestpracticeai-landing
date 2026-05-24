import { Helmet } from 'react-helmet-async'
import { ServiceLayout, ContentBlock } from './ServiceLayout'

export function NeuralNetworksTraining() {
  return (
    <>
      <Helmet>
        <title>Обучение применению нейросетей — Best Practice AI</title>
        <meta name="description" content="Групповые и индивидуальные занятия по нейросетям для бизнеса. Промптинг, ИИ-ассистенты, агенты, вайбкодинг." />
      </Helmet>
      <ServiceLayout
        slug="neural-networks-training"
        heroTitle="Обучение применению генеративных нейросетей для работы и жизни"
        heroSubtitle="Практические занятия, которые сразу применяете в работе. Без теоретической воды — только то, что работает."
        ctaLabel="Запросить программу"
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="service-detail-grid">
            <div>
              <ContentBlock
                title="Темы программы"
                items={[
                  'Основы промптинга: как получать нужные результаты от любого ИИ',
                  'Обзор и выбор нейросетей под ваши задачи',
                  'ИИ для текста, изображений, видео и аудио',
                  'Создание персональных ИИ-ассистентов',
                  'Автоматизация рутины с помощью ИИ-агентов',
                  'Вайбкодинг: создание приложений без знания программирования',
                  'ИИ для конкретных функций: HR, маркетинг, операции, безопасность',
                ]}
              />
            </div>
            <div>
              <ContentBlock
                title="Форматы"
                items={[
                  'Корпоративный тренинг (группа от 5 до 30 человек)',
                  'Индивидуальные занятия',
                  'Онлайн и офлайн',
                ]}
              />
              <div style={{ background: 'linear-gradient(135deg, rgba(11,29,58,0.04), rgba(212,175,55,0.08))', borderRadius: 16, padding: 28, border: '1px solid rgba(212,175,55,0.2)' }}>
                <h4 style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--bp-dark-blue)', marginBottom: 12 }}>
                  Аудитория
                </h4>
                <p style={{ fontFamily: 'var(--bp-font-body)', fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                  Руководители, специалисты любых функций, предприниматели — все, кто хочет работать эффективнее с помощью ИИ.
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
