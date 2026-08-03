// A API pública do WikiTree ficou atrás de um desafio anti-bot (AWS WAF) nos
// testes feitos durante o desenvolvimento (respostas 202 vazias sem chamada
// via navegador real). Pode funcionar a partir de um navegador de verdade,
// mas não há garantia — por isso essa função falha silenciosamente
// (retorna null) em vez de quebrar a Central de Pesquisa.
const WIKITREE_API = 'https://api.wikitree.com/api.php'

export async function fetchWikiTreeProfiles(surname, limit = 5) {
  try {
    const url = `${WIKITREE_API}?action=SearchPerson&LastName=${encodeURIComponent(
      surname
    )}&fields=Id,FirstName,LastNameAtBirth,BirthDate,DeathDate&limit=${limit}&format=json`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const matches = data?.[0]?.matches
    if (!Array.isArray(matches) || matches.length === 0) return null

    return {
      source: 'wikitree',
      profiles: matches.map((m) => ({
        id: m.Id,
        name: `${m.FirstName ?? ''} ${m.LastNameAtBirth ?? ''}`.trim(),
        birthDate: m.BirthDate ?? null,
        deathDate: m.DeathDate ?? null,
        url: `https://www.wikitree.com/wiki/${m.Id}`,
      })),
    }
  } catch {
    return null
  }
}
