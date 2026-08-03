export default function NotablePeopleList({ title, people }) {
  if (!people?.length) return null

  return (
    <div className="mb-4 rounded-2xl border border-amber-800/15 bg-amber-50/80 p-5 backdrop-blur-md">
      <h3 className="mb-2 text-sm font-semibold text-stone-700">{title}</h3>
      <ul className="space-y-1">
        {people.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-green-800 underline"
            >
              {p.name}
            </a>
            {(p.birthDate || p.deathDate) && (
              <span className="ml-1 text-xs text-stone-500">
                ({p.birthDate ?? '?'}–{p.deathDate ?? ''})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
