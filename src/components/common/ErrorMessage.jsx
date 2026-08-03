export default function ErrorMessage({ children }) {
  return (
    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
      {children}
    </p>
  )
}
