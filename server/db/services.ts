import type Database from 'better-sqlite3'
import { SERVICES_FALLBACK, type ServiceContent } from '../data/servicesFallback.js'

export interface ServiceRow {
  slug: string
  name: string
  seo_title: string
  seo_description: string
  hero_subtitle: string
  card_image: string | null
  card_num: string | null
  card_description: string
  blocks: string
  faq: string
  portfolio: string
  sort_order: number
  published: number
  updated_at: string
}

export interface ServiceDto extends ServiceContent {
  published: boolean
  updated_at?: string
}

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? (v as T) : fallback
  } catch {
    return fallback
  }
}

export function rowToDto(row: ServiceRow): ServiceDto {
  return {
    slug: row.slug,
    name: row.name,
    title: row.seo_title,
    description: row.seo_description,
    hero_subtitle: row.hero_subtitle ?? '',
    card_image: row.card_image ?? '',
    card_num: row.card_num ?? '',
    card_description: row.card_description ?? '',
    blocks: parseJson(row.blocks, []),
    faq: parseJson(row.faq, []),
    portfolio: parseJson(row.portfolio, []),
    sort_order: row.sort_order ?? 0,
    published: row.published === 1,
    updated_at: row.updated_at,
  }
}

function fallbackToDto(s: ServiceContent): ServiceDto {
  return { ...s, published: true }
}

const FALLBACK_LIST = Object.values(SERVICES_FALLBACK).sort((a, b) => a.sort_order - b.sort_order)

/** Первичный сид: выполняется только если таблица пуста — ничего не перезаписывает */
export function seedServices(db: Database.Database): void {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM services').get() as { c: number }
  if (c > 0) return
  const insert = db.prepare(`
    INSERT INTO services (slug, name, seo_title, seo_description, hero_subtitle, card_image, card_num, card_description, blocks, faq, portfolio, sort_order, published)
    VALUES (@slug, @name, @seo_title, @seo_description, @hero_subtitle, @card_image, @card_num, @card_description, @blocks, @faq, @portfolio, @sort_order, 1)
  `)
  const tx = db.transaction((items: ServiceContent[]) => {
    for (const s of items) {
      insert.run({
        slug: s.slug,
        name: s.name,
        seo_title: s.title,
        seo_description: s.description,
        hero_subtitle: s.hero_subtitle,
        card_image: s.card_image,
        card_num: s.card_num,
        card_description: s.card_description,
        blocks: JSON.stringify(s.blocks),
        faq: JSON.stringify(s.faq),
        portfolio: JSON.stringify(s.portfolio),
        sort_order: s.sort_order,
      })
    }
  })
  tx(FALLBACK_LIST)
  console.log(`Seeded ${FALLBACK_LIST.length} services`)
}

/** Опубликованные услуги; при ошибке БД — фолбэк из кода */
export function getPublishedServices(db: Database.Database): ServiceDto[] {
  try {
    const rows = db.prepare('SELECT * FROM services WHERE published=1 ORDER BY sort_order ASC, slug ASC').all() as ServiceRow[]
    return rows.map(rowToDto)
  } catch (e) {
    console.error('services db fallback (list):', e)
    return FALLBACK_LIST.map(fallbackToDto)
  }
}

/** Одна опубликованная услуга; при ошибке БД — фолбэк, при отсутствии — undefined */
export function getPublishedService(db: Database.Database, slug: string): ServiceDto | undefined {
  try {
    const row = db.prepare('SELECT * FROM services WHERE slug=? AND published=1').get(slug) as ServiceRow | undefined
    return row ? rowToDto(row) : undefined
  } catch (e) {
    console.error('services db fallback (get):', e)
    const s = SERVICES_FALLBACK[slug]
    return s ? fallbackToDto(s) : undefined
  }
}
