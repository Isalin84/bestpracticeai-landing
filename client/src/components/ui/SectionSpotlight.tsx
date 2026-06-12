import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

/**
 * Курсорная подсветка для тёмных секций: мягкое золотое пятно следует за мышью.
 * Вешается на родительскую секцию (она должна быть position: relative).
 */
export function SectionSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const spring = { stiffness: 130, damping: 26 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)
  const background = useMotionTemplate`radial-gradient(620px circle at ${sx}px ${sy}px, rgba(212,175,55,0.07), transparent 70%)`

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const parent = ref.current?.parentElement
    if (!parent) return

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mx.set(e.clientX - rect.left)
      my.set(e.clientY - rect.top)
    }
    const onLeave = () => {
      mx.set(-9999)
      my.set(-9999)
    }

    setEnabled(true)
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    return () => {
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [mx, my])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: enabled ? background : undefined,
      }}
    />
  )
}
