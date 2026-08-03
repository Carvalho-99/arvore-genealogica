export default function OriginSummaryCard({ label, description, wikidataUrl }) {
  return (
    <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-stone-800">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
        {label}
      </h2>
      <p className="mt-1 text-sm capitalize text-stone-500 dark:text-stone-400">
        {description}
      </p>
      <a
        href={wikidataUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-sm text-stone-500 underline dark:text-stone-400"
      >
        Ver no Wikidata →
      </a>
    </div>
  )
}
