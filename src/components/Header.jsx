import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({ title, subtitle, back = false, right = null }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-verde-500 via-verde-600 to-azul-500 text-white shadow-card">
      <div className="flag-stripe" />
      <div className="px-4 pt-4 pb-5 safe-top">
        <div className="flex items-center gap-3">
          {back && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center backdrop-blur-sm"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-white/80 truncate">{subtitle}</p>
            )}
          </div>
          {right}
        </div>
      </div>
    </header>
  )
}
