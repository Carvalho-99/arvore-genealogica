export default function NationalityCard({ countries, spheres }) {
  if (!countries?.length) return null

  return (
    <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-5 backdrop-blur-md">
      <h3 className="mb-1 text-sm font-semibold text-slate-200">
        Nacionalidade provável (Forebears/OnoGraph)
      </h3>
      <p className="mb-3 text-xs text-slate-500">
        Estimativa estatística baseada só no padrão do nome, não é uma
        confirmação de nacionalidade real.
      </p>
      <ul className="space-y-1">
        {countries.map((c) => (
          <li key={c.name} className="flex justify-between text-sm text-slate-300">
            <span>{c.name}</span>
            <span className="text-cyan-300">{c.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      {spheres?.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          Tradição de nome:{' '}
          {spheres.map((s) => `${s.name} (${s.percent.toFixed(1)}%)`).join(', ')}
        </p>
      )}
    </div>
  )
}
