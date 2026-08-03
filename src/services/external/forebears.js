// A API da OnoGraph/Forebears não permite chamada direta do navegador
// (sem header CORS), então passamos por um proxy simples (Cloudflare
// Worker) que guarda a chave de API do lado de fora do bundle público
// e só repassa fn/sn pra API de verdade.
// Não é sensível (é só a URL pública do proxy), por isso fica fixo no
// código em vez de exigir mais uma variável de ambiente/secret.
const PROXY_URL = 'https://summer-king-149b.brunocalves99.workers.dev'

export const isConfigured = Boolean(PROXY_URL)

// A API OnoGraph exige nome E sobrenome — não dá pra consultar só o
// sobrenome. Por isso essa fonte só entra em jogo quando a pessoa
// preenche um primeiro nome opcional na Central de Pesquisa.
export async function fetchNationalityInfo(forename, surname) {
  if (!isConfigured || !forename || !surname) return null

  const url = `${PROXY_URL}?fn=${encodeURIComponent(forename)}&sn=${encodeURIComponent(surname)}`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()

    const hasError = data.status?.some((s) => s.type === 'error')
    if (hasError || !data.countries?.length) return null

    return {
      source: 'forebears',
      countries: data.countries.slice(0, 5).map((c) => ({
        name: c.jurisdiction,
        percent: Number(c.percent),
      })),
      spheres: (data.spheres ?? []).slice(0, 3).map((s) => ({
        name: s.sphere,
        percent: Number(s.percent),
      })),
    }
  } catch {
    return null
  }
}
