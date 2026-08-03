const VERTICAL_SPACING = 2.4
const RADIUS_PER_GEN = 2.2
const BASE_RADIUS = 1.4

// Calcula uma posição 3D pra cada pessoa: gera "camadas" por geração
// (pais acima ou abaixo dependendo do sinal) e distribui cada camada
// num círculo cujo raio cresce com a distância da geração raiz — isso
// faz a árvore parecer uma copa se espalhando em todas as direções em
// vez de um leque achatado, o que fica muito melhor girando em 3D.
export function computeTreeLayout(people, rootId) {
  const byId = new Map(people.map((p) => [p.id, p]))
  if (!byId.has(rootId)) return { nodes: [], edges: [] }

  const generation = new Map()
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

  // Agrupa por geração (só quem está conectado à raiz entra na cena)
  const byGen = new Map()
  for (const [id, gen] of generation) {
    if (!byGen.has(gen)) byGen.set(gen, [])
    byGen.get(gen).push(id)
  }

  const positions = new Map()
  const sortedGens = [...byGen.keys()].sort((a, b) => a - b)

  for (const gen of sortedGens) {
    const ids = byGen.get(gen)

    // Ordena pra deixar cônjuges lado a lado e filhos perto da posição
    // média dos pais (quando já posicionados numa geração anterior).
    ids.sort((a, b) => {
      const anchorA = parentAnchorX(byId.get(a), positions)
      const anchorB = parentAnchorX(byId.get(b), positions)
      return anchorA - anchorB
    })

    const n = ids.length

    ids.forEach((id, index) => {
      // a pessoa raiz fica sempre no centro exato (raio 0); qualquer
      // outra pessoa na mesma geração dela (cônjuge, irmãos) precisa
      // de raio pra não empilhar em cima da raiz e virar um ponto só
      const radius =
        id === rootId ? 0 : BASE_RADIUS + RADIUS_PER_GEN * Math.max(1, Math.abs(gen))
      const angle =
        n === 1 ? 0 : (index / n) * Math.PI * 2 + (gen % 2 === 0 ? 0 : Math.PI / n)
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      const y = gen * VERTICAL_SPACING
      positions.set(id, { x, y, z })
    })
  }

  const nodes = [...positions.entries()].map(([id, pos]) => ({
    id,
    person: byId.get(id),
    ...pos,
  }))

  const edges = []
  const seenSpousePairs = new Set()
  for (const node of nodes) {
    for (const parentId of node.person.parentIds ?? []) {
      const parentPos = positions.get(parentId)
      if (parentPos) edges.push({ type: 'parent', from: parentPos, to: node })
    }
    for (const spouseId of node.person.spouseIds ?? []) {
      const pairKey = [node.id, spouseId].sort().join('-')
      const spousePos = positions.get(spouseId)
      if (spousePos && !seenSpousePairs.has(pairKey)) {
        seenSpousePairs.add(pairKey)
        edges.push({ type: 'spouse', from: node, to: { ...spousePos, id: spouseId } })
      }
    }
  }

  return { nodes, edges }
}

function parentAnchorX(person, positions) {
  const parentPositions = (person?.parentIds ?? [])
    .map((id) => positions.get(id))
    .filter(Boolean)
  if (!parentPositions.length) return 0
  return parentPositions.reduce((sum, p) => sum + p.x, 0) / parentPositions.length
}
