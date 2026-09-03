// Фоновое видео Hero. Переключение версий — поменять ACTIVE_HERO.
export const ACTIVE_HERO: 'hero1' | 'hero2' | 'hero3' = 'hero3'

export const HERO_SOURCES = {
  hero1: {
    scrub: '/assets/hero/hero1-scrub.mp4',
    loop: '/assets/hero/hero1-loop.mp4',
    poster: '/assets/hero/hero1-poster.webp',
    duration: 10,
  },
  hero2: {
    scrub: '/assets/hero/hero2-scrub.mp4',
    loop: '/assets/hero/hero2-loop.mp4',
    poster: '/assets/hero/hero2-poster.webp',
    duration: 12,
  },
  hero3: {
    scrub: '/assets/hero/hero3-scrub.mp4',
    loop: '/assets/hero/hero3-loop.mp4',
    poster: '/assets/hero/hero3-poster.webp',
    duration: 10.33,
  },
} as const

export const HERO_VIDEO = HERO_SOURCES[ACTIVE_HERO]
