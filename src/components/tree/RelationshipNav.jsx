const rows = [
  { type: 'parents', label: 'Pais', icon: '⬆️' },
  { type: 'spouses', label: 'Cônjuge', icon: '💍' },
  { type: 'children', label: 'Filhos', icon: '⬇️' },
  { type: 'siblings', label: 'Irmãos', icon: '↔️' },
]

export default function RelationshipNav({ counts, onOpen }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {rows.map((row) => (
        <button
          key={row.type}
          onClick={() => onOpen(row.type)}
          className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-slate-900/60 px-4 py-3 text-left backdrop-blur-md active:bg-slate-800/80"
        >
          <span className="text-sm font-medium text-slate-200">
            {row.icon} {row.label}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-cyan-300">
            {counts[row.type] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}
