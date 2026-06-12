import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 72,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: '0%',
        scaleX,
        background: 'linear-gradient(90deg, var(--bp-gold), var(--bp-soft-gold))',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  )
}
