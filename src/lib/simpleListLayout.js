// Motor da lista simples — geração ABSOLUTA (contada a partir dos
// ancestrais mais antigos pra baixo), diferente da árvore visual (que
// conta a geração relativa a uma pessoa raiz). Cada "bloco" é um casal
// (ou pessoa solteira) com os filhos listados embaixo; só vira um bloco
// com cabeçalho de geração se tiver filho(s) ou se não tiver pais
// cadastrados (ponto de partida da árvore) — do contrário a pessoa já
// aparece como filha de outro bloco, sem precisar de cabeçalho próprio.
export function computeSimpleListTree(people) {
  const byId = new Map(people.map((p) => [p.id, p]))

  // une cônjuges nos dois sentidos, mesmo que só um lado tenha o campo
  const spouseMap = new Map()
  const addSpouse = (a, b) => {
    if (!spouseMap.has(a)) spouseMap.set(a, new Set())
    spouseMap.get(a).add(b)
  }
  for (const p of people) {
    for (const sid of p.spouseIds ?? []) {
      if (!byId.has(sid)) continue
      addSpouse(p.id, sid)
      addSpouse(sid, p.id)
    }
  }

  // geração de nascimento: sem pais cadastrados = 1; com pais = 1 + a
  // maior geração entre os pais
  const birthGen = new Map()
  const computing = new Set()
  function genOf(id) {
    if (birthGen.has(id)) return birthGen.get(id)
    if (computing.has(id)) return 1 // proteção contra ciclo acidental
    computing.add(id)
    const person = byId.get(id)
    const parentIds = (person?.parentIds ?? []).filter((pid) => byId.has(pid))
    const g = parentIds.length ? 1 + Math.max(...parentIds.map(genOf)) : 1
    computing.delete(id)
    birthGen.set(id, g)
    return g
  }
  for (const p of people) genOf(p.id)

  // agrupa em unidades (casal ou pessoa solteira)
  const unitOf = new Map()
  const units = []
  for (const p of people) {
    if (unitOf.has(p.id)) continue
    const spouseId = [...(spouseMap.get(p.id) ?? [])].find((sid) => byId.has(sid) && !unitOf.has(sid))
    const members = spouseId ? [p.id, spouseId] : [p.id]
    const unit = { members, gen: Math.max(...members.map(genOf)) }
    units.push(unit)
    for (const m of members) unitOf.set(m, unit)
  }

  for (const unit of units) {
    unit.children = people
      .filter((p) => (p.parentIds ?? []).some((pid) => unit.members.includes(pid)))
      .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0))
  }

  const blocks = units.filter(
    (u) =>
      u.children.length > 0 ||
      u.members.every((id) => !(byId.get(id)?.parentIds ?? []).length)
  )

  blocks.sort((a, b) => {
    const ca = Math.min(...a.members.map((id) => byId.get(id)?.createdAt?.seconds ?? 0))
    const cb = Math.min(...b.members.map((id) => byId.get(id)?.createdAt?.seconds ?? 0))
    return ca - cb
  })

  const byGen = new Map()
  for (const block of blocks) {
    const list = byGen.get(block.gen) ?? []
    list.push({
      members: block.members.map((id) => byId.get(id)),
      children: block.children,
    })
    byGen.set(block.gen, list)
  }

  return [...byGen.keys()]
    .sort((a, b) => a - b)
    .map((gen) => ({ gen, blocks: byGen.get(gen) }))
}
