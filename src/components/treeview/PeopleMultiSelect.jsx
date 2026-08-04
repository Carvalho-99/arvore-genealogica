import { useState } from 'react'

export default function PeopleMultiSelect({ label, selectedIds, onChange, excludeIds = [], allPeople }) {
  const [query, setQuery] = useState('')
  const excluded = new Set([...excludeIds, ...selectedIds])
  const selected = selectedIds.map((id) => allPeople.find((p) => p.id === id)).filter(Boolean)
  const options = query.trim()
    ? allPeople
        .filter((p) => !excluded.has(p.id) && p.fullName.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 6)
    : []

  return (
    <div>
      <label className="form-label">{label}</label>
      {selected.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(selectedIds.filter((id) => id !== p.id))}
              className="chip"
            >
              {p.nickname || p.fullName} ×
            </button>
          ))}
        </div>
      )}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome..."
        className="form-input"
      />
      {query.trim() && (
        <div className="mt-1 max-h-36 overflow-y-auto rounded-lg border border-amber-100/10 bg-black/40">
          {options.length === 0 && <p className="px-3 py-2 text-xs text-amber-100/40">Ninguém encontrado.</p>}
          {options.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange([...selectedIds, p.id])
                setQuery('')
              }}
              className="block w-full px-3 py-2 text-left text-sm text-amber-50/85 hover:bg-amber-50/10"
            >
              {p.fullName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
