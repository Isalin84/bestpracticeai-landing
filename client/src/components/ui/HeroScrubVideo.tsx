import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { HERO_VIDEO, type HeroVideoMode } from '../../config/heroVideo'

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
    let cancelled = false
    let objectUrl: string | null = null
    const controller = new AbortController()

    const start = () => {
      if (mode !== 'scrub') {
        setSrc(url)
        return
      }
      // Скраб: качаем файл целиком в память и отдаём как blob:. При потоковой загрузке
      // каждый сик в недокачанное место ждёт сеть — при первом заходе кадры «замерзают».
      // Пока качается — остаётся постер; из памяти сики мгновенные. Файл не пережимаем.
      fetch(url, { signal: controller.signal })
        .then(r => {
          if (!r.ok) throw new Error(`hero video ${r.status}`)
          return r.blob()
        })
        .then(blob => {
          if (cancelled) return
          objectUrl = URL.createObjectURL(blob)
          setSrc(objectUrl)
        })
        .catch(() => {
          // Фолбэк — обычная потоковая загрузка (не при отмене на unmount)
          if (!cancelled) setSrc(url)
        })
    }

    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      cancelled = true
      controller.abort()
      window.removeEventListener('load', start)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
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
      // Lenis уже сглаживает сам скролл — здесь только лёгкое сглаживание,
      // иначе видео заметно отстаёт от колеса и «отвязывается» от мышки
      current = Math.abs(delta) < 0.02 ? target : current + delta * 0.5
      // Safari ставит сики в очередь — не пишем, пока предыдущий не закончился
      if (!video.seeking && Math.abs(video.currentTime - current) >= 1 / 48) {
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
