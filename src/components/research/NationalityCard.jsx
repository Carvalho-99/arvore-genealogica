export default function NationalityCard({ countries, spheres }) {
  if (!countries?.length) return null

  return (
    <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-stone-800">
      <h3 className="mb-1 text-sm font-semibold text-stone-700 dark:text-stone-200">
        Nacionalidade provável (Forebears/OnoGraph)
      </h3>
      <p className="mb-3 text-xs text-stone-400">
        Estimativa estatística baseada só no padrão do nome, não é uma
        confirmação de nacionalidade real.
      </p>
      <ul className="space-y-1">
        {countries.map((c) => (
          <li
            key={c.name}
            className="flex justify-between text-sm text-stone-600 dark:text-stone-300"
          >
            <span>{c.name}</span>
            <span className="text-stone-400">{c.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      {spheres?.length > 0 && (
        <p className="mt-3 text-xs text-stone-400">
          Tradição de nome:{' '}
          {spheres.map((s) => `${s.name} (${s.percent.toFixed(1)}%)`).join(', ')}
        </p>
      )}
    </div>
  )
}
