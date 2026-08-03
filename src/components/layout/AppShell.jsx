import BottomTabBar from './BottomTabBar'
import AppBackground from './AppBackground'

export default function AppShell({ children }) {
  return (
    <div className="min-h-svh text-stone-800">
      <AppBackground />
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">{children}</main>
      <BottomTabBar />
    </div>
  )
}
