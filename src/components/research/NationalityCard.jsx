export default function NationalityCard({ countries, spheres }) {
  if (!countries?.length) return null

  return (
    <div className="mb-4 rounded-2xl border border-amber-800/15 bg-amber-50/80 p-5 backdrop-blur-md">
      <h3 className="mb-1 text-sm font-semibold text-stone-700">
        Nacionalidade provável (Forebears/OnoGraph)
      </h3>
      <p className="mb-3 text-xs text-stone-500">
        Estimativa estatística baseada só no padrão do nome, não é uma
        confirmação de nacionalidade real.
      </p>
      <ul className="space-y-1">
        {countries.map((c) => (
          <li key={c.name} className="flex justify-between text-sm text-stone-700">
            <span>{c.name}</span>
            <span className="text-green-800">{c.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      {spheres?.length > 0 && (
        <p className="mt-3 text-xs text-stone-500">
          Tradição de nome:{' '}
          {spheres.map((s) => `${s.name} (${s.percent.toFixed(1)}%)`).join(', ')}
        </p>
      )}
    </div>
  )
}
