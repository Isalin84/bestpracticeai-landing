import { motion } from 'framer-motion'

interface Props {
  title: string
  subtitle?: string
  tone?: 'light' | 'dark'
  marginBottom?: number
  subtitleMaxWidth?: number
}

/** Заголовок секции главной: H2 + подзаголовок, fade-in при появлении. Без кикеров — по решению владельца. */
export function SectionHeading({ title, subtitle, tone = 'light', marginBottom = 48, subtitleMaxWidth }: Props) {
  const dark = tone === 'dark'
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', marginBottom }}
    >
      <h2 style={{
        fontFamily: 'var(--bp-font-heading)',
        fontWeight: 700,
        fontSize: 'clamp(32px, 4.5vw, 52px)',
        letterSpacing: '-0.02em',
        color: dark ? '#fff' : 'var(--bp-dark-blue)',
        margin: subtitle ? '0 0 16px' : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: 'var(--bp-font-body)',
          fontSize: 18,
          color: dark ? 'rgba(250,249,246,0.7)' : '#6b7280',
          maxWidth: subtitleMaxWidth,
          margin: '0 auto',
        }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
