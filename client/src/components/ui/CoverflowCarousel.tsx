import React, { useCallback, useEffect, useRef, useState } from 'react'

interface Props<T> {
  items: T[]
  getKey: (item: T) => string
  renderCard: (item: T, isActive: boolean) => React.ReactNode
  /** Размытый цветной блик под карточкой (обычно картинка карточки) */
  getShadowImage?: (item: T) => string | undefined
  initialIndex?: number
  ariaLabel?: string
  /** Подписи-теги под каруселью; без них рисуются точки-индикаторы */
  renderTag?: (item: T, isActive: boolean) => React.ReactNode
  onActiveChange?: (index: number) => void
  /** Цвета стрелок/тегов под тёмный или светлый фон секции */
  theme?: 'dark' | 'light'
}

const VISIBLE_RANGE = 2

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/**
 * 3D coverflow-карусель (референс weichie.com): активная карточка по центру,
 * соседние развёрнуты по Y и уходят вглубь; бесконечная прокрутка по кругу.
 * Управление: drag, горизонтальное колесо, стрелки, клавиатура, клик по соседней.
 */
export function CoverflowCarousel<T>({ items, getKey, renderCard, getShadowImage, initialIndex = 0, ariaLabel, renderTag, onActiveChange, theme = 'dark' }: Props<T>) {
  const n = items.length
  const [index, setIndex] = useState(initialIndex)
  const [dragX, setDragX] = useState(0)
  const dragStart = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const wheelAcc = useRef(0)
  const wheelLock = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(420)

  useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? 1200
      // ширина карточки: ~34% сцены, в пределах 250–500px
      setCardW(Math.max(250, Math.min(540, w * 0.36)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const spacing = cardW * 0.92
  const isNarrow = cardW < 300

  const go = useCallback((delta: number) => {
    setIndex(i => {
      const next = mod(i + delta, n)
      onActiveChange?.(next)
      return next
    })
  }, [n, onActiveChange])

  // --- drag ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    dragStart.current = e.clientX
    draggingRef.current = false
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    if (Math.abs(dx) > 6) draggingRef.current = true
    setDragX(dx)
  }
  const endDrag = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    dragStart.current = null
    setDragX(0)
    const steps = Math.round(-dx / (spacing * 0.6))
    if (steps !== 0) go(Math.sign(steps) * Math.min(Math.abs(steps), 2))
    // клик сразу после драга не должен срабатывать
    setTimeout(() => { draggingRef.current = false }, 50)
  }

  // --- горизонтальное колесо / трекпад ---
  // Нативный non-passive слушатель: React-овый onWheel пассивный, preventDefault в нём не работает
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      if (wheelLock.current) return
      wheelAcc.current += e.deltaX
      if (Math.abs(wheelAcc.current) > 40) {
        go(Math.sign(wheelAcc.current))
        wheelAcc.current = 0
        wheelLock.current = true
        setTimeout(() => { wheelLock.current = false }, 450)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }

  // Клик по неактивной карточке центрирует её вместо перехода по ссылке
  const onCardClickCapture = (offset: number) => (e: React.MouseEvent) => {
    if (draggingRef.current || offset !== 0) {
      e.preventDefault()
      e.stopPropagation()
      if (!draggingRef.current && offset !== 0) go(offset)
    }
  }

  const cardH = cardW * 1.25
  const dragOffset = dragX / spacing
  // Сколько соседей показывать с каждой стороны, чтобы при малом n элемент не появился дважды по кругу
  const sideRange = Math.min(isNarrow ? 1 : VISIBLE_RANGE, Math.floor((n - 1) / 2))

  return (
    <div aria-label={ariaLabel} role="region" tabIndex={0} onKeyDown={onKeyDown} className={`coverflow coverflow--${theme}`} style={{ outline: 'none' }}>
      <div
        ref={stageRef}
        className="coverflow-stage"
        style={{
          position: 'relative',
          height: cardH + (isNarrow ? 40 : 96), // запас под цветную тень карточки
          perspective: 1800,
          perspectiveOrigin: '50% 45%',
          cursor: dragStart.current !== null ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {Array.from({ length: sideRange * 2 + 1 }, (_, k) => k - sideRange).map(offset => {
          const item = items[mod(index + offset, n)]
          if (!item) return null
          const o = offset + dragOffset // живой сдвиг во время драга
          const abs = Math.abs(o)
          const rotate = Math.max(-42, Math.min(42, -o * 26))
          const x = o * spacing
          const z = -abs * 110
          const scale = Math.max(0.84, 1 - abs * 0.05)
          const opacity = abs > VISIBLE_RANGE + 0.3 ? 0 : Math.max(0, 1 - Math.max(0, abs - 1.6) * 1.2)
          const isActive = offset === 0
          const shadow = getShadowImage?.(item)

          return (
            <div
              key={getKey(item)}
              className="coverflow-card"
              onClickCapture={onCardClickCapture(offset)}
              // Соседняя карточка aria-hidden: не даём браузеру перевести на неё фокус при mousedown
              onMouseDown={offset !== 0 ? e => e.preventDefault() : undefined}
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2,
                transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotate}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                transition: dragStart.current !== null
                  ? 'none'
                  : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, filter 0.5s ease',
                opacity,
                zIndex: 20 - Math.round(abs * 4),
                filter: isActive ? 'none' : `brightness(${Math.max(0.7, 1 - abs * 0.14)})`,
                pointerEvents: opacity === 0 ? 'none' : 'auto',
              }}
            >
              {shadow && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '8%',
                    right: '8%',
                    bottom: -28,
                    height: '38%',
                    backgroundImage: `url(${shadow})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                    filter: 'blur(28px) saturate(1.3)',
                    opacity: isActive ? 0.55 : 0.3,
                    transform: 'translateZ(-1px)',
                    borderRadius: 24,
                    pointerEvents: 'none',
                    transition: 'opacity 0.5s ease',
                  }}
                />
              )}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {renderCard(item, isActive)}
              </div>
            </div>
          )
        })}
      </div>

      {n > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 16, maxWidth: 1280, margin: '24px auto 0', padding: '0 8px' }}>
          <button onClick={() => go(-1)} className="coverflow-arrow" aria-label="Назад">←</button>
          {renderTag ? (
            <div className="coverflow-tags">
              {items.map((item, i) => (
                <button
                  key={getKey(item)}
                  onClick={() => { onActiveChange?.(i); setIndex(i) }}
                  className={`coverflow-tag ${i === index ? 'is-active' : ''}`}
                >
                  {renderTag(item, i === index)}
                </button>
              ))}
            </div>
          ) : (
            <div className="coverflow-dots">
              {items.map((item, i) => (
                <button
                  key={getKey(item)}
                  onClick={() => { onActiveChange?.(i); setIndex(i) }}
                  className={`coverflow-dot ${i === index ? 'is-active' : ''}`}
                  aria-label={`Слайд ${i + 1}`}
                />
              ))}
            </div>
          )}
          <button onClick={() => go(1)} className="coverflow-arrow" aria-label="Вперёд">→</button>
        </div>
      )}

      <style>{`
        .coverflow:focus-visible { outline: 2px solid var(--bp-gold); outline-offset: 6px; border-radius: 24px; }
        .coverflow-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2px solid rgba(212,175,55,0.4); background: transparent;
          color: var(--bp-gold); font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .coverflow-arrow:hover { background: var(--bp-gold); border-color: var(--bp-gold); color: var(--bp-dark-blue); }
        .coverflow-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .coverflow-tag {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 13px; border-radius: 100px;
          border: 1px solid rgba(212,175,55,0.25); background: rgba(255,255,255,0.03);
          color: rgba(250,249,246,0.7); font-family: var(--bp-font-heading); font-weight: 600; font-size: 12.5px; line-height: 1.2;
          cursor: pointer; transition: all 0.25s ease;
        }
        .coverflow-tag:hover { border-color: rgba(212,175,55,0.6); color: #fff; }
        .coverflow-tag.is-active { background: var(--bp-gold); border-color: var(--bp-gold); color: var(--bp-dark-blue); }
        .coverflow-dots { display: flex; gap: 8px; justify-content: center; align-items: center; }
        .coverflow-dot {
          width: 8px; height: 8px; border-radius: 4px; border: none; padding: 0; cursor: pointer;
          background: rgba(255,255,255,0.2); transition: width 0.3s, background 0.3s;
        }
        .coverflow-dot.is-active { width: 32px; background: var(--bp-gold); }

        /* Светлая секция: тёмно-синие стрелки, теги и точки */
        .coverflow--light .coverflow-arrow { border-color: rgba(var(--bp-dark-blue-rgb), 0.25); color: var(--bp-dark-blue); }
        .coverflow--light .coverflow-arrow:hover { background: var(--bp-gold); border-color: var(--bp-gold); color: var(--bp-dark-blue); }
        .coverflow--light .coverflow-tag { border-color: rgba(var(--bp-dark-blue-rgb), 0.15); background: rgba(255,255,255,0.6); color: #4b5563; }
        .coverflow--light .coverflow-tag:hover { border-color: rgba(212,175,55,0.7); color: var(--bp-dark-blue); }
        .coverflow--light .coverflow-dot { background: rgba(var(--bp-dark-blue-rgb), 0.18); }
        .coverflow--light .coverflow-dot.is-active { background: var(--bp-gold); }
        @media (max-width: 640px) {
          .coverflow-tags { display: none; }
        }
      `}</style>
    </div>
  )
}
