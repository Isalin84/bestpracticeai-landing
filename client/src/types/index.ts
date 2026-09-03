export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_url: string | null
  published: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  name: string
  position: string | null
  company: string | null
  text: string
  photo_url: string | null
  published: number
  sort_order: number
  created_at: string
}

export interface Lead {
  id: number
  full_name: string
  company: string | null
  phone: string
  message: string | null
  status: 'new' | 'in_progress' | 'done'
  created_at: string
}

export interface PortfolioVideo {
  id: number
  service_slug: string
  kinescope_id: string
  title: string | null
  caption: string | null
  aspect_ratio: '16:9' | '9:16'
  sort_order: number
  published: number
  created_at: string
}

export interface ServiceBlock {
  heading: string
  items: string[]
}

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServicePortfolioItem {
  name: string
  description: string
  href?: string
}

export interface Service {
  slug: string
  name: string
  title: string
  description: string
  hero_subtitle: string
  card_image: string
  card_num: string
  card_description: string
  blocks: ServiceBlock[]
  faq: ServiceFaq[]
  portfolio: ServicePortfolioItem[]
  sort_order: number
  published: boolean
  updated_at?: string
}

export interface Settings {
  [key: string]: string
}

export interface LeadFormData {
  full_name: string
  company?: string
  phone: string
  message: string
  consent: boolean
  honeypot?: string
}
