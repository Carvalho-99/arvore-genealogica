export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700 dark:border-stone-600 dark:border-t-stone-200" />
    </div>
  )
}
