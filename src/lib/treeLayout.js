// Motor de layout genealógico automático.
//
// Ninguém posiciona nada manualmente: a posição de cada pessoa é calculada
// a partir de quem são os pais, cônjuges e filhos dela. O algoritmo segue a
// ideia clássica de "layered layout" (Sugiyama simplificado):
//   1. cada pessoa recebe uma "geração" (nível vertical) via BFS a partir da
//      raiz — pais ficam acima, filhos abaixo, cônjuges na mesma geração.
//   2. pessoas casadas entre si viram uma "unidade" (ficam sempre lado a
//      lado dentro da geração).
//   3. a ordem horizontal de cada geração é resolvida de fora pra dentro
//      (das gerações mais próximas da raiz para as mais distantes) usando o
//      baricentro dos pais/filhos já posicionados — isso é o que evita
//      cruzamentos de linha e mantém cada família visualmente agrupada.

const SLOT_WIDTH = 190
const SPOUSE_GAP = 34
const UNIT_GAP = 80
const LEVEL_HEIGHT = 250
const MARGIN_X = 220
const MARGIN_Y = 200

export function computeTreeLayout(people, rootId) {
  const byId = new Map(people.map((p) => [p.id, p]))
  const empty = { nodes: [], edges: [], width: 0, height: 0 }
  if (!rootId || !byId.has(rootId)) return empty

  // trata "cônjuge" como relação simétrica mesmo que só um dos dois lados
  // tenha o spouseIds preenchido (evita casais se espalharem pela árvore
  // se os dados algum dia ficarem inconsistentes)
  const spouseMap = buildSpouseMap(byId)

  const generation = computeGenerations(byId, spouseMap, rootId)
  if (generation.size === 0) return empty

  const genGroups = new Map() // gen -> personId[]
  for (const [id, gen] of generation) {
    if (!genGroups.has(gen)) genGroups.set(gen, [])
    genGroups.get(gen).push(id)
  }

  // agrupa cada geração em "unidades" (pessoa + cônjuge(s) dela na mesma geração)
  const unitsByGen = new Map() // gen -> unit[] where unit = { members: personId[] }
  const unitOfPerson = new Map() // personId -> unit ref
  for (const [gen, ids] of genGroups) {
    const visited = new Set()
    const units = []
    for (const id of ids) {
      if (visited.has(id)) continue
      const members = [id]
      visited.add(id)
      for (const spouseId of spouseMap.get(id) ?? []) {
        if (generation.get(spouseId) === gen && !visited.has(spouseId) && byId.has(spouseId)) {
          members.push(spouseId)
          visited.add(spouseId)
        }
      }
      const unit = { gen, members, x: 0, order: units.length }
      units.push(unit)
      for (const m of members) unitOfPerson.set(m, unit)
    }
    unitsByGen.set(gen, units)
  }

  const gens = [...unitsByGen.keys()].sort((a, b) => a - b)
  const rootGen = generation.get(rootId)

  // ordena a geração 0 (raiz) primeiro, colocando a unidade da raiz no centro
  const gen0Units = unitsByGen.get(rootGen) ?? []
  const rootUnit = unitOfPerson.get(rootId)
  gen0Units.sort((a, b) => {
    if (a === rootUnit) return -1
    if (b === rootUnit) return 1
    return a.order - b.order
  })
  assignX(gen0Units)

  // sobe da geração 0 até o topo (ancestrais), cada nível usa o baricentro dos filhos
  const above = gens.filter((g) => g < rootGen).sort((a, b) => b - a)
  for (const g of above) {
    const units = unitsByGen.get(g)
    orderByBarycenter(units, (unit) => childrenXOf(unit, byId, unitOfPerson, generation, g))
    assignX(units)
  }

  // desce da geração 0 até o fundo (descendentes), cada nível usa o baricentro dos pais
  const below = gens.filter((g) => g > rootGen).sort((a, b) => a - b)
  for (const g of below) {
    const units = unitsByGen.get(g)
    orderByBarycenter(units, (unit) => parentsXOf(unit, byId, unitOfPerson))
    assignX(units)
  }

  // posição final de cada pessoa (x = posição dentro da unidade, y = geração)
  const nodes = []
  let minX = Infinity
  let maxX = -Infinity
  for (const g of gens) {
    for (const unit of unitsByGen.get(g)) {
      const unitSpan = spouseSpan(unit.members.length)
      unit.members.forEach((id, i) => {
        const offset = -unitSpan / 2 + SLOT_WIDTH / 2 + i * (SLOT_WIDTH + SPOUSE_GAP)
        const x = unit.x + offset
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        nodes.push({
          id,
          person: byId.get(id),
          gen: g,
          x,
          y: g * LEVEL_HEIGHT,
          isRoot: id === rootId,
          hasSpouseInUnit: unit.members.length > 1,
        })
      })
    }
  }

  const minGen = gens[0]
  const maxGen = gens[gens.length - 1]
  const shiftX = MARGIN_X - minX
  const shiftY = MARGIN_Y - minGen * LEVEL_HEIGHT

  for (const node of nodes) {
    node.x += shiftX
    node.y += shiftY
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const edges = []

  // linhas de cônjuge
  for (const g of gens) {
    for (const unit of unitsByGen.get(g)) {
      for (let i = 0; i < unit.members.length - 1; i++) {
        const a = nodeById.get(unit.members[i])
        const b = nodeById.get(unit.members[i + 1])
        edges.push({ type: 'spouse', x1: a.x, y1: a.y, x2: b.x, y2: b.y })
      }
    }
  }

  // linhas de pai/mãe → filho (uma por filho, ancorada no meio dos pais presentes)
  for (const node of nodes) {
    const person = node.person
    const parentIds = (person.parentIds ?? []).filter((id) => nodeById.has(id))
    if (parentIds.length === 0) continue
    const parentNodes = parentIds.map((id) => nodeById.get(id))
    const anchorX = parentNodes.reduce((sum, p) => sum + p.x, 0) / parentNodes.length
    const anchorY = parentNodes[0].y
    edges.push({ type: 'parent-child', x1: anchorX, y1: anchorY, x2: node.x, y2: node.y })
  }

  const width = maxX - minX + MARGIN_X * 2
  const height = (maxGen - minGen) * LEVEL_HEIGHT + MARGIN_Y * 2

  return { nodes, edges, width, height }
}

// A árvore nunca é redimensionada em função de quantas pessoas existem —
// a cena (câmera + fundo) é sempre do tamanho da viewport. Em vez disso,
// encaixamos a árvore (que tem seu próprio tamanho "natural" calculado
// acima) dentro da viewport disponível, crescendo/encolhendo as placas
// junto (um family menor aparece um pouco maior, um family grande aparece
// mais compacto, mas sempre nítido e nunca cortado).
export function fitLayoutToViewport(layout, viewportWidth, viewportHeight) {
  if (!layout.nodes.length || !viewportWidth || !viewportHeight) {
    return { scale: 1, offsetX: 0, offsetY: 0 }
  }
  const marginRatio = 0.8
  const scaleX = (viewportWidth * marginRatio) / layout.width
  const scaleY = (viewportHeight * marginRatio) / layout.height
  let scale = Math.min(scaleX, scaleY)
  scale = Math.min(scale, 1.3)
  scale = Math.max(scale, 0.22)
  const offsetX = (viewportWidth - layout.width * scale) / 2
  const offsetY = (viewportHeight - layout.height * scale) / 2
  return { scale, offsetX, offsetY }
}

function spouseSpan(memberCount) {
  return memberCount * SLOT_WIDTH + (memberCount - 1) * SPOUSE_GAP
}

function assignX(units) {
  let cursor = 0
  for (const unit of units) {
    const span = spouseSpan(unit.members.length)
    unit.x = cursor + span / 2
    cursor += span + UNIT_GAP
  }
  const totalWidth = cursor - UNIT_GAP
  const offset = totalWidth / 2
  for (const unit of units) unit.x -= offset
}

function orderByBarycenter(units, getReferenceXs) {
  const scored = units.map((unit, i) => {
    const refs = getReferenceXs(unit)
    const score = refs.length ? refs.reduce((s, v) => s + v, 0) / refs.length : Number.MAX_SAFE_INTEGER
    return { unit, score, i }
  })
  scored.sort((a, b) => a.score - b.score || a.i - b.i)
  const ordered = scored.map((s) => s.unit)
  units.length = 0
  units.push(...ordered)
}

function childrenXOf(unit, byId, unitOfPerson, generation, gen) {
  const xs = []
  for (const memberId of unit.members) {
    for (const [id, p] of byId) {
      if ((p.parentIds ?? []).includes(memberId) && generation.get(id) === gen + 1) {
        const childUnit = unitOfPerson.get(id)
        if (childUnit && childUnit.x !== undefined) xs.push(childUnit.x)
      }
    }
  }
  return xs
}

function parentsXOf(unit, byId, unitOfPerson) {
  const xs = []
  for (const memberId of unit.members) {
    const person = byId.get(memberId)
    for (const parentId of person.parentIds ?? []) {
      const parentUnit = unitOfPerson.get(parentId)
      if (parentUnit && parentUnit.x !== undefined) xs.push(parentUnit.x)
    }
  }
  return xs
}

// une spouseIds nos dois sentidos, pra não depender de qual dos dois lados
// da relação foi de fato gravado no documento
function buildSpouseMap(byId) {
  const map = new Map()
  const add = (a, b) => {
    if (!map.has(a)) map.set(a, new Set())
    map.get(a).add(b)
  }
  for (const [id, person] of byId) {
    for (const spouseId of person.spouseIds ?? []) {
      if (!byId.has(spouseId)) continue
      add(id, spouseId)
      add(spouseId, id)
    }
  }
  return map
}

// pais = geração -1, filhos = geração +1, cônjuges ficam na mesma geração
function computeGenerations(byId, spouseMap, rootId) {
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
    for (const spouseId of spouseMap.get(id) ?? []) {
      if (!generation.has(spouseId) && byId.has(spouseId)) {
        generation.set(spouseId, gen)
        queue.push(spouseId)
      }
    }
    for (const [otherId, other] of byId) {
      if ((other.parentIds ?? []).includes(id) && !generation.has(otherId)) {
        generation.set(otherId, gen + 1)
        queue.push(otherId)
      }
    }
  }

  return generation
}
