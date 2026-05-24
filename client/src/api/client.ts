const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Public
  getArticles: (page = 1, limit = 6) =>
    request<{ articles: import('../types').Article[]; total: number; hasMore: boolean }>(
      `/articles?page=${page}&limit=${limit}`
    ),
  getArticle: (slug: string) =>
    request<import('../types').Article>(`/articles/${slug}`),
  getReviews: () =>
    request<import('../types').Review[]>('/reviews'),
  getPortfolio: (serviceSlug: string) =>
    request<import('../types').PortfolioVideo[]>(`/portfolio?service_slug=${serviceSlug}`),
  getSettings: () =>
    request<import('../types').Settings>('/settings'),
  submitLead: (data: Omit<import('../types').LeadFormData, 'consent'>) =>
    request<{ message: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin auth
  login: (password: string) =>
    request<{ message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }),
  me: () =>
    request<{ admin: boolean }>('/auth/me'),

  // Admin articles
  adminGetArticles: () =>
    request<import('../types').Article[]>('/articles/admin/all'),
  adminCreateArticle: (data: Partial<import('../types').Article>) =>
    request<import('../types').Article>('/articles/admin', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateArticle: (id: number, data: Partial<import('../types').Article>) =>
    request<import('../types').Article>(`/articles/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteArticle: (id: number) =>
    request<{ message: string }>(`/articles/admin/${id}`, { method: 'DELETE' }),

  // Admin reviews
  adminGetReviews: () =>
    request<import('../types').Review[]>('/reviews/admin/all'),
  adminCreateReview: (data: Partial<import('../types').Review>) =>
    request<import('../types').Review>('/reviews/admin', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateReview: (id: number, data: Partial<import('../types').Review>) =>
    request<import('../types').Review>(`/reviews/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteReview: (id: number) =>
    request<{ message: string }>(`/reviews/admin/${id}`, { method: 'DELETE' }),

  // Admin leads
  adminGetLeads: () =>
    request<import('../types').Lead[]>('/leads/admin/all'),
  adminUpdateLead: (id: number, data: Partial<import('../types').Lead>) =>
    request<import('../types').Lead>(`/leads/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin portfolio
  adminGetPortfolio: () =>
    request<import('../types').PortfolioVideo[]>('/portfolio/admin/all'),
  adminCreateVideo: (data: Partial<import('../types').PortfolioVideo>) =>
    request<import('../types').PortfolioVideo>('/portfolio/admin', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateVideo: (id: number, data: Partial<import('../types').PortfolioVideo>) =>
    request<import('../types').PortfolioVideo>(`/portfolio/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteVideo: (id: number) =>
    request<{ message: string }>(`/portfolio/admin/${id}`, { method: 'DELETE' }),

  // Admin settings
  adminUpdateSetting: (key: string, value: string) =>
    request<{ message: string }>(`/settings/admin/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
}
