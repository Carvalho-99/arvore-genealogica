import { useState } from 'react'

export default function SurnameSearchForm({ defaultValue, onSearch }) {
  const [surname, setSurname] = useState(defaultValue)
  const [forename, setForename] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (surname.trim()) onSearch(surname.trim(), forename.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="mb-1 space-y-2">
      <div className="flex gap-2">
        <input
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-base outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
          placeholder="Sobrenome"
        />
        <button
          type="submit"
          className="rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-medium text-white active:bg-stone-700 dark:bg-stone-100 dark:text-stone-900"
        >
          Buscar
        </button>
      </div>
      <input
        value={forename}
        onChange={(e) => setForename(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-base outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
        placeholder="Primeiro nome (opcional, pra ver a nacionalidade provável)"
      />
    </form>
  )
}
