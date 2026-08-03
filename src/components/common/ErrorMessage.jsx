export default function ErrorMessage({ children }) {
  return (
    <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  )
}
