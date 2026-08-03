export default function OriginSummaryCard({ label, description, wikidataUrl }) {
  return (
    <div className="mb-4 rounded-2xl border border-amber-800/15 bg-amber-50/80 p-5 backdrop-blur-md">
      <h2 className="text-lg font-semibold text-stone-800">{label}</h2>
      <p className="mt-1 text-sm capitalize text-stone-500">{description}</p>
      <a
        href={wikidataUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-sm text-green-800 underline"
      >
        Ver no Wikidata →
      </a>
    </div>
  )
}
