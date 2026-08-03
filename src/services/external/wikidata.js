const WIKIDATA_API = 'https://www.wikidata.org/w/api.php'
const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

// origin=* habilita CORS pra chamadas direto do navegador.
async function searchSurnameEntity(surname) {
  const url = `${WIKIDATA_API}?action=wbsearchentities&search=${encodeURIComponent(surname)}&language=pt&format=json&origin=*&limit=10`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wikidata search failed')
  const data = await res.json()
  return (
    data.search?.find((item) => item.description === 'family name') ?? null
  )
}

async function fetchNotablePeople(entityId, limit = 8) {
  const query = `SELECT ?person ?personLabel WHERE {
    ?person wdt:P734 wd:${entityId} .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
  } LIMIT ${limit}`
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`
  const res = await fetch(url, { headers: { Accept: 'application/sparql-results+json' } })
  if (!res.ok) throw new Error('Wikidata SPARQL failed')
  const data = await res.json()
  return (data.results?.bindings ?? [])
    .map((b) => ({
      id: b.person.value.split('/').pop(),
      name: b.personLabel.value,
      url: b.person.value,
    }))
    // sem label em pt/en, o serviço de label devolve o próprio QID como texto
    .filter((p) => !/^Q\d+$/.test(p.name))
}

export async function fetchSurnameInfo(surname) {
  const entity = await searchSurnameEntity(surname)
  if (!entity) return null

  const notablePeople = await fetchNotablePeople(entity.id).catch(() => [])

  return {
    source: 'wikidata',
    label: entity.label,
    description: entity.description,
    wikidataUrl: `https://www.wikidata.org/wiki/${entity.id}`,
    notablePeople,
  }
}
