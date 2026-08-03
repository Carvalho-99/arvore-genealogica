import { useState } from 'react'

export default function SurnameSearchForm({ defaultValue, onSearch }) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-base outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
        placeholder="Sobrenome"
      />
      <button
        type="submit"
        className="rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-medium text-white active:bg-stone-700 dark:bg-stone-100 dark:text-stone-900"
      >
        Buscar
      </button>
    </form>
  )
}
