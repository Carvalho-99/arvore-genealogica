import { useState } from 'react'
import Modal from '../common/Modal'
import { usePeople } from '../../context/PeopleContext'

export default function PersonListView({ onSelect, onClose }) {
  const { people } = usePeople()
  const [query, setQuery] = useState('')

  const results = people
    .filter((p) => p.fullName.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <Modal title="Ir para..." onClose={onClose}>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome..."
        className="mb-3 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-base outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
      />
      <div className="max-h-72 space-y-1 overflow-y-auto">
        {results.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              onSelect(p.id)
              onClose()
            }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-stone-700 active:bg-stone-100 dark:text-stone-200 dark:active:bg-stone-700"
          >
            {p.fullName}
          </button>
        ))}
      </div>
    </Modal>
  )
}
