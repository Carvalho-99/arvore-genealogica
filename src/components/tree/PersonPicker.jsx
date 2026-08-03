import { useState } from 'react'
import Modal from '../common/Modal'
import { usePeople } from '../../context/PeopleContext'

export default function PersonPicker({ title, excludeIds = [], onSelect, onClose }) {
  const { people } = usePeople()
  const [query, setQuery] = useState('')

  const excluded = new Set(excludeIds)
  const results = people
    .filter((p) => !excluded.has(p.id))
    .filter((p) => p.fullName.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <Modal title={title} onClose={onClose}>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome..."
        className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-cyan-400/60"
      />
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {results.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-500">
            Ninguém encontrado.
          </p>
        )}
        {results.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 active:bg-slate-800"
          >
            {p.fullName}
          </button>
        ))}
      </div>
    </Modal>
  )
}
