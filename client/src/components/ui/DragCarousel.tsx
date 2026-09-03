import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

interface Props {
  children: React.ReactNode
  gap?: number
  /** Шаг стрелок, px. По умолчанию — ширина первой карточки + gap */
  step?: number
  ariaLabel?: string
  /** Цвет стрелок под тёмный/светлый фон секции */
  theme?: 'dark' | 'light'
  /** Выравнивание блока стрелок */
  arrowsAlign?: 'center' | 'right'
}

/**
 * Горизонтальная draggable-карусель (weichie-стиль): инерционный drag,
 * стрелки, guard «drag ≠ click» для вложенных ссылок.
 */
export function DragCarousel({ children, gap = 24, step, ariaLabel, theme = 'dark', arrowsAlign = 'center' }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [maxDrag, setMaxDrag] = useState(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current
      const track = trackRef.current
      if (!viewport || !track) return
      setMaxDrag(Math.max(0, track.scrollWidth - viewport.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [children])

  const arrowStep = useCallback(() => {
    if (step) return step
    const first = trackRef.current?.children[0] as HTMLElement | undefined
    return (first?.offsetWidth ?? 320) + gap
  }, [step, gap])

  const nudge = (dir: 1 | -1) => {
    const next = Math.min(0, Math.max(-maxDrag, x.get() - dir * arrowStep()))
    animate(x, next, { type: 'spring', stiffness: 260, damping: 34 })
  }

  // Клик по карточке не должен срабатывать после драга
  const onClickCapture = (e: React.MouseEvent) => {
    if (draggingRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const arrowStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: theme === 'dark' ? '2px solid rgba(212,175,55,0.4)' : '2px solid rgba(11,29,58,0.25)',
    background: 'transparent',
    cursor: 'pointer',
    color: theme === 'dark' ? 'var(--bp-gold)' : 'var(--bp-dark-blue)',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  }
  const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'var(--bp-gold)'
    e.currentTarget.style.borderColor = 'var(--bp-gold)'
    e.currentTarget.style.color = 'var(--bp-dark-blue)'
  }
  const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(212,175,55,0.4)' : 'rgba(11,29,58,0.25)'
    e.currentTarget.style.color = theme === 'dark' ? 'var(--bp-gold)' : 'var(--bp-dark-blue)'
  }

  return (
    <div aria-label={ariaLabel} role="region">
      <div ref={viewportRef} style={{ overflow: 'hidden' }}>
        <motion.div
          ref={trackRef}
          drag={maxDrag > 0 ? 'x' : false}
          // ref-констрейнты: framer сам меряет границы контейнера; числовые {0,0} на старте ломают позицию
          dragConstraints={viewportRef}
          dragElastic={0.12}
          dragTransition={{ power: 0.25, timeConstant: 250 }}
          onDragStart={() => { draggingRef.current = true }}
          onDragEnd={() => { setTimeout(() => { draggingRef.current = false }, 60) }}
          onClickCapture={onClickCapture}
          style={{
            display: 'flex',
            gap,
            x,
            touchAction: 'pan-y',
            cursor: maxDrag > 0 ? 'grab' : 'default',
            width: 'max-content',
          }}
          whileTap={maxDrag > 0 ? { cursor: 'grabbing' } : undefined}
        >
          {children}
        </motion.div>
      </div>

      {maxDrag > 0 && (
        <div style={{ display: 'flex', justifyContent: arrowsAlign === 'right' ? 'flex-end' : 'center', gap: 16, marginTop: 32 }}>
          <button onClick={() => nudge(-1)} style={arrowStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} aria-label="Назад">
            ←
          </button>
          <button onClick={() => nudge(1)} style={arrowStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} aria-label="Вперёд">
            →
          </button>
        </div>
      )}
    </div>
  )
}
