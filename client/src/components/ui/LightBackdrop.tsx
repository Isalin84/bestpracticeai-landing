interface Props {
  /** Точка фокуса фото (background-position) — чтобы соседние секции не выглядели одинаково */
  position?: string
  opacity?: number
}

/**
 * Полупрозрачное фирменное фото под светлыми секциями (аналог фона в «Отзывах»).
 * Секция-родитель должна иметь position: relative и isolation: isolate —
 * тогда z-index -1 уводит фон под контент, но над фоном секции.
 */
export function LightBackdrop({ position = 'center', opacity = 0.16 }: Props) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'url(/assets/decorative/keyboard-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: position,
          opacity,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'linear-gradient(180deg, var(--bp-light-bg) 0%, rgba(250,249,246,0.35) 30%, rgba(250,249,246,0.35) 70%, var(--bp-light-bg) 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
