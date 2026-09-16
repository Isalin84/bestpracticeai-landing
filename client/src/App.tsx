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

// Ленивые чанки: в основной бандл попадают только главная и каркас.
const ServicePage = lazy(() => import('./pages/services/ServicePage').then(m => ({ default: m.ServicePage })))
const ArticlePage = lazy(() => import('./pages/ArticlePage').then(m => ({ default: m.ArticlePage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads').then(m => ({ default: m.AdminLeads })))
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles').then(m => ({ default: m.AdminArticles })))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })))
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio').then(m => ({ default: m.AdminPortfolio })))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })))
const AdminServices = lazy(() => import('./pages/admin/AdminServices').then(m => ({ default: m.AdminServices })))

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
      { path: 'blog/:slug', element: <Suspense fallback={<ServiceFallback />}><ArticlePage /></Suspense> },
      { path: 'privacy', element: <Suspense fallback={<ServiceFallback />}><PrivacyPage /></Suspense> },
      { path: 'services/:slug', element: <Suspense fallback={<ServiceFallback />}><ServicePage /></Suspense> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <Suspense fallback={<ServiceFallback />}><AdminLogin /></Suspense> },
  {
    path: '/admin',
    element: <Suspense fallback={<ServiceFallback />}><AdminLayout /></Suspense>,
    children: [
      { index: true, element: <Suspense fallback={<ServiceFallback />}><AdminDashboard /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<ServiceFallback />}><AdminDashboard /></Suspense> },
      { path: 'leads', element: <Suspense fallback={<ServiceFallback />}><AdminLeads /></Suspense> },
      { path: 'articles', element: <Suspense fallback={<ServiceFallback />}><AdminArticles /></Suspense> },
      { path: 'reviews', element: <Suspense fallback={<ServiceFallback />}><AdminReviews /></Suspense> },
      { path: 'portfolio', element: <Suspense fallback={<ServiceFallback />}><AdminPortfolio /></Suspense> },
      { path: 'services', element: <Suspense fallback={<ServiceFallback />}><AdminServices /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<ServiceFallback />}><AdminSettings /></Suspense> },
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
