import { motion } from 'framer-motion'

interface Props {
  kinescopeId: string
}

const CORNERS = [
  { top: -10, left: -10, rotate: 0 },
  { top: -10, right: -10, rotate: 90 },
  { bottom: -10, right: -10, rotate: 180 },
  { bottom: -10, left: -10, rotate: 270 },
] as const

export function DeviceFrame({ kinescopeId }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 580, paddingBottom: 36 }}>

      {/* Ambient glow behind the video */}
      <motion.div
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: -30,
          borderRadius: 36,
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Pulsing gold border ring */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 1.5px rgba(212,175,55,0.3), 0 20px 60px rgba(0,0,0,0.5)',
            '0 0 0 1.5px rgba(212,175,55,0.75), 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.2)',
            '0 0 0 1.5px rgba(212,175,55,0.3), 0 20px 60px rgba(0,0,0,0.5)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          background: '#000',
        }}
      >
        {kinescopeId ? (
          <iframe
            src={`https://kinescope.io/embed/${kinescopeId}`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="Best Practice AI — демо"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, var(--bp-steel-blue), var(--bp-dark-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bp-gold)',
            fontFamily: 'var(--bp-font-heading)',
            fontSize: 14,
          }}>
            Видео в разработке
          </div>
        )}
      </motion.div>

      {/* Corner brackets */}
      {CORNERS.map((corner, i) => {
        const { rotate, ...pos } = corner
        return (
          <motion.svg
            key={i}
            width="20" height="20"
            viewBox="0 0 20 20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            style={{
              position: 'absolute',
              ...(pos as Record<string, number>),
              zIndex: 2,
              transform: `rotate(${rotate}deg)`,
              pointerEvents: 'none',
            }}
          >
            <path
              d="M3 17 L3 3 L17 3"
              stroke="var(--bp-gold)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      })}

      {/* Scanning light sweep across the video */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '35%',
          bottom: 36,
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)',
          borderRadius: 20,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 2,
      }}>
        <div style={{ flex: 1, maxWidth: 56, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.35))' }} />
        <span style={{
          fontFamily: 'var(--bp-font-heading)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.4)',
        }}>
          Best Practice AI
        </span>
        <div style={{ flex: 1, maxWidth: 56, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.35))' }} />
      </div>
    </div>
  )
}
