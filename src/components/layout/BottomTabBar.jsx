import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Árvore', icon: '🌳', end: true },
  { to: '/arvore-3d', label: 'Árvore 3D', icon: '🌲' },
  { to: '/pesquisa', label: 'Pesquisa', icon: '🔎' },
]

export default function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-cyan-400/20 bg-slate-950/80 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              isActive
                ? 'text-cyan-300 [text-shadow:0_0_10px_rgba(34,211,238,0.6)]'
                : 'text-slate-500'
            }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
