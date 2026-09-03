type Tone = 'light' | 'dark'

interface Props {
  tone: Tone
  /** Своё фото вместо дефолтного для тона */
  image?: string
  /** Точка фокуса фото (background-position) — чтобы соседние секции не выглядели одинаково */
  position?: string
  /** Доля фото, видимая в средней полосе секции (0–1). У верхнего и нижнего края фон всегда сплошной */
  strength?: number
}

const TONES: Record<Tone, { image: string; rgb: string; strength: number }> = {
  light: { image: '/assets/decorative/keyboard-bg.webp', rgb: 'var(--bp-light-bg-rgb)', strength: 0.09 },
  dark: { image: '/assets/decorative/reviews-bg.webp', rgb: 'var(--bp-dark-blue-rgb)', strength: 0.14 },
}

/**
 * Полупрозрачное фирменное фото под секцией: один слой, градиент цвета секции поверх фото.
 * Без opacity на слое (нет отдельного compositing-буфера) и без z-index —
 * порядок задаёт `Section`: backdrop первым в DOM, контент в обёртке с z-index 1.
 */
export function SectionBackdrop({ tone, image, position = 'center', strength }: Props) {
  const t = TONES[tone]
  const alpha = (1 - (strength ?? t.strength)).toFixed(3)
  const solid = `rgb(${t.rgb})`
  const mid = `rgba(${t.rgb}, ${alpha})`
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(180deg, ${solid} 0%, ${mid} 30%, ${mid} 70%, ${solid} 100%), url(${image ?? t.image})`,
        backgroundSize: 'cover, cover',
        backgroundPosition: `center, ${position}`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
