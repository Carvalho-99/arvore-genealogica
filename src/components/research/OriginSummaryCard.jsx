export default function OriginSummaryCard({ label, description, wikidataUrl }) {
  return (
    <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-5 backdrop-blur-md">
      <h2 className="text-lg font-semibold text-slate-100">{label}</h2>
      <p className="mt-1 text-sm capitalize text-slate-400">{description}</p>
      <a
        href={wikidataUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-sm text-cyan-300 underline"
      >
        Ver no Wikidata →
      </a>
    </div>
  )
}
