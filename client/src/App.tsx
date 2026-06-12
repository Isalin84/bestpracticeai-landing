import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { Header } from './components/sections/Header'
import { Footer } from './components/sections/Footer'
import { CookieBanner } from './components/ui/CookieBanner'
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

const CorporateAiVideo = lazy(() => import('./pages/services/CorporateAiVideo').then(m => ({ default: m.CorporateAiVideo })))
const AiVideoTraining = lazy(() => import('./pages/services/AiVideoTraining').then(m => ({ default: m.AiVideoTraining })))
const NeuralNetworksTraining = lazy(() => import('./pages/services/NeuralNetworksTraining').then(m => ({ default: m.NeuralNetworksTraining })))
const Vibecoding = lazy(() => import('./pages/services/Vibecoding').then(m => ({ default: m.Vibecoding })))
const Additional = lazy(() => import('./pages/services/Additional').then(m => ({ default: m.Additional })))

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
      <CookieBanner />
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
      {
        path: 'services',
        children: [
          { path: 'corporate-ai-video', element: <Suspense fallback={<ServiceFallback />}><CorporateAiVideo /></Suspense> },
          { path: 'ai-video-training', element: <Suspense fallback={<ServiceFallback />}><AiVideoTraining /></Suspense> },
          { path: 'neural-networks-training', element: <Suspense fallback={<ServiceFallback />}><NeuralNetworksTraining /></Suspense> },
          { path: 'vibecoding', element: <Suspense fallback={<ServiceFallback />}><Vibecoding /></Suspense> },
          { path: 'additional', element: <Suspense fallback={<ServiceFallback />}><Additional /></Suspense> },
        ],
      },
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
