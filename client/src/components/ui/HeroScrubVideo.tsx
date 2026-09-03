import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { HERO_VIDEO } from '../../config/heroVideo'

export type HeroVideoMode = 'scrub' | 'loop' | 'static'

export function getHeroVideoMode(): HeroVideoMode {
  if (typeof window === 'undefined') return 'static'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return 'loop'
  return 'scrub'
}

interface Props {
  mode: HeroVideoMode
  progress: MotionValue<number>
}

const layerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  pointerEvents: 'none',
}

/**
 * Фоновый слой Hero: скраб по скроллу (desktop), автоплей-луп (mobile),
 * статичный постер (reduced-motion). Скраб-видео закодировано all-intra,
 * поэтому присвоение currentTime дешёвое; лерп в rAF сглаживает быстрые
 * рывки скролла, снап на концах гарантирует полное докручивание.
 */
export function HeroScrubVideo({ mode, progress }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // src ставим после загрузки страницы, чтобы тяжёлый mp4 не мешал LCP
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'static') return
    const url = mode === 'scrub' ? HERO_VIDEO.scrub : HERO_VIDEO.loop
    if (document.readyState === 'complete') {
      setSrc(url)
      return
    }
    const onLoad = () => setSrc(url)
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [mode])

  useEffect(() => {
    if (mode !== 'scrub') return
    const video = videoRef.current
    if (!video || !src) return

    let raf = 0
    let current = 0
    let duration: number = HERO_VIDEO.duration

    const onMeta = () => {
      if (video.duration && isFinite(video.duration)) duration = video.duration
    }
    video.addEventListener('loadedmetadata', onMeta)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (video.readyState < 2) return
      const target = progress.get() * duration
      const delta = target - current
      current = Math.abs(delta) < 0.02 ? target : current + delta * 0.18
      // Safari ставит сики в очередь — не пишем, пока предыдущий не закончился
      if (!video.seeking && Math.abs(video.currentTime - current) >= 1 / 24) {
        video.currentTime = current
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onMeta)
    }
  }, [mode, src, progress])

  if (mode === 'static' || !src) {
    return <img src={HERO_VIDEO.poster} alt="" aria-hidden="true" style={layerStyle} />
  }

  if (mode === 'loop') {
    return (
      <video
        src={src}
        poster={HERO_VIDEO.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={layerStyle}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={HERO_VIDEO.poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      style={layerStyle}
    />
  )
}
