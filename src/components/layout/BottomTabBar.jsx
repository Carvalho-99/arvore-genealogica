import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Árvore', icon: '🌳', end: true },
  { to: '/arvore-3d', label: 'Árvore 3D', icon: '🌲' },
  { to: '/pesquisa', label: 'Pesquisa', icon: '🔎' },
]

export default function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-amber-800/15 bg-amber-50/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              isActive ? 'text-green-700' : 'text-stone-400'
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
