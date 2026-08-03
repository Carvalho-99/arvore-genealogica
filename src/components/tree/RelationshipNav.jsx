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
          className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left shadow-sm active:bg-stone-100 dark:bg-stone-800 dark:active:bg-stone-700"
        >
          <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {row.icon} {row.label}
          </span>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-500 dark:bg-stone-700 dark:text-stone-300">
            {counts[row.type] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}
