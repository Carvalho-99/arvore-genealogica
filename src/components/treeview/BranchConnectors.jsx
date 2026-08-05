import { useMemo } from 'react'

const base = import.meta.env.BASE_URL
const STICK_THICKNESS = 28
const SPOUSE_THICKNESS = 24
const PARENT_DROP = 34 // sai um pouco abaixo do centro da placa dos pais
const CHILD_LIFT = 42 // termina um pouco acima do centro da placa do filho

// Motor de conectores construído com o kit de galhos (Manus) em vez de
// linhas SVG. `galho_vertical` funciona como um "graveto" flexível: gira
// e estica pra apontar de um ponto a outro, então qualquer número de
// filhos em qualquer posição sempre encaixa (não depende de alinhar com
// uma peça de junção rígida pré-desenhada). `galho_conexao_y` é usado uma
// vez por casal pra representar a fusão dos dois antes de abrir os
// gravetos pros filhos — exatamente como pedido: "Casal → filho = galho
// em Y", "Casal → três filhos = galho em Y + extensão".
export default function BranchConnectors({ nodes, spouseEdges }) {
  const groups = useMemo(() => groupByParentUnit(nodes), [nodes])

  return (
    <div className="branch-layer" aria-hidden="true">
      {spouseEdges.map((e, i) => (
        <SpouseBranch key={`sp-${i}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
      ))}

      {groups.map((g, gi) => {
        if (g.parentPoints.length === 2) {
          const [pA, pB] = [...g.parentPoints].sort((a, b) => a.x - b.x)
          const gapY = Math.abs((g.children[0]?.y ?? pA.y + 180) - pA.y)
          const mergeHeight = Math.max(56, Math.min(130, gapY * 0.42))
          const merge = coupleMerge(pA.x, pA.y + PARENT_DROP, pB.x, pB.y + PARENT_DROP, mergeHeight)
          return (
            <div key={gi}>
              {merge.el}
              {g.children.map((c, ci) => (
                <Stick key={`${gi}-${ci}`} x1={merge.x} y1={merge.y} x2={c.x} y2={c.y - CHILD_LIFT} />
              ))}
            </div>
          )
        }
        const p = g.parentPoints[0]
        return g.children.map((c, ci) => (
          <Stick key={`${gi}-${ci}`} x1={p.x} y1={p.y + PARENT_DROP} x2={c.x} y2={c.y - CHILD_LIFT} />
        ))
      })}
    </div>
  )
}

// agrupa cada filho pela unidade de pais exata (mesmo casal = mesmo
// tronco), pra desenhar a fusão em Y uma única vez por casal
function groupByParentUnit(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const groups = new Map()
  for (const node of nodes) {
    const parentIds = (node.person.parentIds ?? []).filter((id) => byId.has(id))
    if (parentIds.length === 0) continue
    const key = [...parentIds].sort().join('|')
    if (!groups.has(key)) {
      groups.set(key, {
        parentPoints: parentIds.map((id) => ({ x: byId.get(id).x, y: byId.get(id).y })),
        children: [],
      })
    }
    groups.get(key).children.push({ x: node.x, y: node.y })
  }
  return [...groups.values()]
}

function Stick({ x1, y1, x2, y2 }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)
  if (length < 2) return null
  const angleDeg = Math.atan2(-dx, dy) * (180 / Math.PI)
  return (
    <img
      src={`${base}images/branches/galho_vertical.webp`}
      alt=""
      draggable={false}
      className="branch-stick"
      style={{
        left: x1 - STICK_THICKNESS / 2,
        top: y1,
        width: STICK_THICKNESS,
        height: length,
        transform: `rotate(${angleDeg}deg)`,
        transformOrigin: '50% 0%',
      }}
    />
  )
}

function SpouseBranch({ x1, y1, x2 }) {
  const left = Math.min(x1, x2)
  const width = Math.abs(x2 - x1)
  if (width < 2) return null
  return (
    <img
      src={`${base}images/branches/galho_horizontal.webp`}
      alt=""
      draggable={false}
      className="branch-stick"
      style={{ left, top: y1 - SPOUSE_THICKNESS / 2, width, height: SPOUSE_THICKNESS }}
    />
  )
}

// galho_conexao_y "de fábrica" tem o tronco único no topo e as duas pernas
// embaixo — de ponta-cabeça pro que precisamos (casal em cima, tronco
// saindo pra baixo), então é desenhado espelhado verticalmente. Depois de
// espelhar: pernas ficam a 11% do topo (uma em cada ponta), tronco fica
// bem embaixo, no centro.
function coupleMerge(ax, ay, bx, by, height) {
  const width = bx - ax
  const legFrac = 0.11
  const top = ay - legFrac * height
  const mergeX = ax + width / 2
  const mergeY = top + height
  if (width < 2) {
    return { x: mergeX, y: ay, el: null }
  }
  const el = (
    <img
      src={`${base}images/branches/galho_conexao_y.webp`}
      alt=""
      draggable={false}
      className="branch-stick"
      style={{ left: ax, top, width, height, transform: 'scaleY(-1)' }}
    />
  )
  return { x: mergeX, y: mergeY, el }
}
