import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { ToastProvider } from './components/Toast'
import BottomNav from './components/BottomNav'

import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Stickers from './pages/Stickers'
import SearchPage from './pages/SearchPage'
import PhotoScan from './pages/PhotoScan'
import Pages from './pages/Pages'
import Missing from './pages/Missing'
import Duplicates from './pages/Duplicates'
import Trades from './pages/Trades'
import Settings from './pages/Settings'
import Games from './pages/Games'
import QuickAdd from './pages/QuickAdd'

// HashRouter works well in static deploys (Netlify/Vercel/GitHub Pages) without server config
export default function App() {
  const onboarded = useStore((s) => s.settings.onboarded)

  return (
    <ToastProvider>
      <HashRouter>
        {!onboarded ? (
          <Onboarding />
        ) : (
          <div className="max-w-md mx-auto bg-white min-h-screen relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/figurinhas" element={<Stickers />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/foto" element={<PhotoScan />} />
              <Route path="/paginas" element={<Pages />} />
              <Route path="/faltantes" element={<Missing />} />
              <Route path="/repetidas" element={<Duplicates />} />
              <Route path="/trocas" element={<Trades />} />
              <Route path="/jogos" element={<Games />} />
              <Route path="/adicionar" element={<QuickAdd />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </div>
        )}
      </HashRouter>
    </ToastProvider>
  )
}
