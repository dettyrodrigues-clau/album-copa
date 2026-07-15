import { NavLink } from 'react-router-dom'
import { Home, Grid3x3, Search, Camera, CalendarDays } from 'lucide-react'

const items = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/figurinhas', icon: Grid3x3, label: 'Figurinhas' },
  { to: '/buscar', icon: Search, label: 'Buscar' },
  { to: '/foto', icon: Camera, label: 'Foto' },
  { to: '/jogos', icon: CalendarDays, label: 'Jogos' }
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-cinza-200 shadow-[0_-4px_20px_rgba(0,39,118,0.06)] safe-bottom">
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[11px] font-semibold transition-colors
                ${isActive ? 'text-verde-600' : 'text-cinza-500 hover:text-cinza-700'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all
                    ${isActive ? 'bg-verde-100 scale-105' : ''}`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
