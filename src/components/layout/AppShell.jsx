import BottomTabBar from './BottomTabBar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-900">
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">{children}</main>
      <BottomTabBar />
    </div>
  )
}
