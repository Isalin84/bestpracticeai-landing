import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { Header } from './components/sections/Header'
import { Footer } from './components/sections/Footer'
import { ScrollToTop } from './components/ui/ScrollToTop'
import { useYandexMetrika } from './hooks/useYandexMetrika'
import { useLenis } from './hooks/useLenis'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ArticlePage } from './pages/ArticlePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminLeads } from './pages/admin/AdminLeads'
import { AdminArticles } from './pages/admin/AdminArticles'
import { AdminReviews } from './pages/admin/AdminReviews'
import { AdminPortfolio } from './pages/admin/AdminPortfolio'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminServices } from './pages/admin/AdminServices'

const ServicePage = lazy(() => import('./pages/services/ServicePage').then(m => ({ default: m.ServicePage })))

function PublicLayout() {
  useYandexMetrika()
  useLenis()
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

function ServiceFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bp-light-bg)' }}>
      <div style={{ fontFamily: 'var(--bp-font-body)', color: '#9ca3af' }}>Загружаем...</div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog/:slug', element: <ArticlePage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'services/:slug', element: <Suspense fallback={<ServiceFallback />}><ServicePage /></Suspense> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'leads', element: <AdminLeads /> },
      { path: 'articles', element: <AdminArticles /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'portfolio', element: <AdminPortfolio /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
])

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--bp-font-heading)',
            fontSize: 14,
            borderRadius: 10,
          },
        }}
      />
    </HelmetProvider>
  )
}
