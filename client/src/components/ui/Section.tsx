import { SectionBackdrop, type SectionBackdropProps } from './SectionBackdrop'
import { SectionSpotlight } from './SectionSpotlight'

interface Props {
  id: string
  tone: 'light' | 'dark'
  padding?: string
  /** Фото-подложка; `false` — без неё */
  backdrop?: Omit<SectionBackdropProps, 'tone'> | false
  children: React.ReactNode
}

/**
 * Каркас секции главной: фон по тону, золотая topline, фото-подложка,
 * для тёмных — зерно и курсорный spotlight. Контент всегда рисуется поверх
 * декоративных слоёв (зерно z-index 0, spotlight z-index 1) — обёртка с z-index 1.
 */
export function Section({ id, tone, padding = '80px 0', backdrop = {}, children }: Props) {
  const dark = tone === 'dark'
  return (
    <section
      id={id}
      className={dark ? 'bp-grain' : undefined}
      style={{
        background: dark ? 'var(--bp-dark-blue)' : 'var(--bp-light-bg)',
        padding,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {backdrop && <SectionBackdrop tone={tone} {...backdrop} />}
      <div className="section-topline" aria-hidden="true" />
      {dark && <SectionSpotlight />}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  )
}
