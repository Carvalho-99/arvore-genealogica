export default function NotablePeopleList({ title, people }) {
  if (!people?.length) return null

  return (
    <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-stone-800">
      <h3 className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
        {title}
      </h3>
      <ul className="space-y-1">
        {people.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-stone-600 underline dark:text-stone-300"
            >
              {p.name}
            </a>
            {(p.birthDate || p.deathDate) && (
              <span className="ml-1 text-xs text-stone-400">
                ({p.birthDate ?? '?'}–{p.deathDate ?? ''})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
