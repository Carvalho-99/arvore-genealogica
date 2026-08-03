import { useState } from 'react'

const inputClass =
  'rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-cyan-400/60'

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
          className={`flex-1 ${inputClass}`}
          placeholder="Sobrenome"
        />
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950"
        >
          Buscar
        </button>
      </div>
      <input
        value={forename}
        onChange={(e) => setForename(e.target.value)}
        className={`w-full ${inputClass}`}
        placeholder="Primeiro nome (opcional, pra ver a nacionalidade provável)"
      />
    </form>
  )
}
