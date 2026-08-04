import { useState } from 'react'
import { usePeople } from '../../context/PeopleContext'

export default function SearchOverlay({ onSelect, onClose }) {
  const { people } = usePeople()
  const [query, setQuery] = useState('')

  const results = people
    .filter((p) => p.fullName.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="form-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-xl text-amber-50">Ir para...</h2>
          <button onClick={onClose} className="detail-close static" aria-label="Fechar">
            ×
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome..."
          className="form-input mb-3"
        />
        <div className="max-h-72 space-y-1 overflow-y-auto">
          {results.map((p) => (
            <button key={p.id} onClick={() => onSelect(p.id)} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-amber-50/85 hover:bg-amber-50/10">
              {p.fullName}
            </button>
          ))}
          {results.length === 0 && <p className="py-4 text-center text-sm text-amber-100/40">Ninguém encontrado.</p>}
        </div>
      </div>
    </div>
  )
}
