// Calcula a "geração" de cada pessoa em relação à raiz (pais = -1,
// avós = -2, filhos = +1, netos = +2, cônjuges ficam na mesma geração
// um do outro). Usado só pra ordenar quem fica mais perto do centro
// da copa da árvore ilustrada.
export function computeGenerations(people, rootId) {
  const byId = new Map(people.map((p) => [p.id, p]))
  const generation = new Map()
  if (!byId.has(rootId)) return generation

  generation.set(rootId, 0)
  const queue = [rootId]

  while (queue.length) {
    const id = queue.shift()
    const gen = generation.get(id)
    const person = byId.get(id)
    if (!person) continue

    for (const parentId of person.parentIds ?? []) {
      if (!generation.has(parentId) && byId.has(parentId)) {
        generation.set(parentId, gen - 1)
        queue.push(parentId)
      }
    }
    for (const spouseId of person.spouseIds ?? []) {
      if (!generation.has(spouseId) && byId.has(spouseId)) {
        generation.set(spouseId, gen)
        queue.push(spouseId)
      }
    }
    for (const other of people) {
      if ((other.parentIds ?? []).includes(id) && !generation.has(other.id)) {
        generation.set(other.id, gen + 1)
        queue.push(other.id)
      }
    }
  }

  return generation
}
