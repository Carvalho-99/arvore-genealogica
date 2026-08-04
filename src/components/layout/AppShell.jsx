import { useLocation } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'
import AppBackground from './AppBackground'

export default function AppShell({ children }) {
  const location = useLocation()
  const onIllustratedTree = location.pathname === '/arvore-3d'

  return (
    <div className="min-h-svh text-stone-800">
      <AppBackground showTree={!onIllustratedTree} />
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">{children}</main>
      <BottomTabBar />
    </div>
  )
}
