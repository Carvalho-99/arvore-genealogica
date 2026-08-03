import BottomTabBar from './BottomTabBar'
import HolographicBackground from './HolographicBackground'

export default function AppShell({ children }) {
  return (
    <div className="min-h-svh text-slate-100">
      <HolographicBackground />
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">{children}</main>
      <BottomTabBar />
    </div>
  )
}
