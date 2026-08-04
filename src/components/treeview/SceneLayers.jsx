import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Creatures from './Creatures'

const base = import.meta.env.BASE_URL
const scene = (name) => `${base}images/scenes/${name}.webp`

// Camadas de trás pra frente. `dx`/`dy` = quanto cada uma se move no
// parallax passivo (em px, na maior amplitude) — o fundo quase não se
// move, a folhagem da frente é a que mais acompanha o mouse.
const PERIOD_LAYERS = [
  { key: 'ceu', dx: 2, dy: 1.3 },
  { key: 'floresta_fundo', dx: 4, dy: 2.6 },
  { key: 'arvore', dx: 7, dy: 4.5 },
]
const EFFECTS_LAYER = { key: 'efeitos', dx: 5, dy: 3 }
const SHARED_LAYERS = [
  { key: 'camada_galhos', dx: 9, dy: 6 },
  { key: 'camada_tronco', dx: 8, dy: 5, shimmer: true },
  { key: 'camada_chao', dx: 6, dy: 4 },
  { key: 'camada_folhas_fundo', dx: 10, dy: 7, sway: true },
]
const FRONT_LEAVES = { key: 'camada_folhas_frente', dx: 15, dy: 10, sway: true }
const CREATURES_PARALLAX = { dx: 12, dy: 8 }

export function periodImageUrls(period) {
  return [
    ...PERIOD_LAYERS.map((l) => scene(`${l.key}_${period}`)),
    scene(`${EFFECTS_LAYER.key}_${period}`),
  ]
}

export function sharedImageUrls() {
  return SHARED_LAYERS.concat(FRONT_LEAVES).map((l) => scene(l.key))
}

const ALL_LAYER_DEFS = [
  ...PERIOD_LAYERS,
  EFFECTS_LAYER,
  ...SHARED_LAYERS,
  FRONT_LEAVES,
  { key: 'creatures', ...CREATURES_PARALLAX },
]

const SceneLayers = forwardRef(function SceneLayers({ period }, ref) {
  const refs = useRef(new Map())
  const idleTimer = useRef(null)

  function setRef(key) {
    return (el) => {
      if (el) refs.current.set(key, el)
      else refs.current.delete(key)
    }
  }

  function resetParallax() {
    for (const el of refs.current.values()) {
      el.style.transform = 'translate(0, 0)'
    }
  }

  useImperativeHandle(ref, () => ({
    applyParallax(px, py) {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      for (const [key, el] of refs.current) {
        const def = ALL_LAYER_DEFS.find((d) => d.key === key)
        if (!def) continue
        el.style.transform = `translate(${px * -def.dx}px, ${py * -def.dy}px)`
      }
      idleTimer.current = setTimeout(resetParallax, 1400)
    },
    resetParallax,
  }))

  return (
    <>
      {PERIOD_LAYERS.map((l) => (
        <div key={l.key} ref={setRef(l.key)} className="parallax-layer">
          <CrossfadeImage srcs={periodSrcMap(l.key)} activeKey={period} />
        </div>
      ))}

      {SHARED_LAYERS.map((l) => (
        <div key={l.key} ref={setRef(l.key)} className="parallax-layer">
          <img
            src={scene(l.key)}
            alt=""
            draggable={false}
            className={`h-full w-full object-cover ${l.shimmer ? 'trunk-shimmer' : ''} ${l.sway ? 'layer-sway' : ''}`}
          />
        </div>
      ))}

      <div ref={setRef(EFFECTS_LAYER.key)} className="parallax-layer">
        <CrossfadeImage srcs={periodSrcMap(EFFECTS_LAYER.key)} activeKey={period} className="effects-pulse" />
      </div>

      <div ref={setRef(FRONT_LEAVES.key)} className="parallax-layer">
        <img
          src={scene(FRONT_LEAVES.key)}
          alt=""
          draggable={false}
          className="h-full w-full object-cover layer-sway"
        />
      </div>

      <div ref={setRef('creatures')} className="parallax-layer">
        <Creatures period={period} />
      </div>
    </>
  )
})

export default SceneLayers

function periodSrcMap(key) {
  return {
    amanhecer: scene(`${key}_amanhecer`),
    dia: scene(`${key}_dia`),
    por_do_sol: scene(`${key}_por_do_sol`),
    noite: scene(`${key}_noite`),
  }
}

function CrossfadeImage({ srcs, activeKey, className = '', blend = false }) {
  const [seen, setSeen] = useState(() => [activeKey])

  useEffect(() => {
    setSeen((prev) => (prev.includes(activeKey) ? prev : [...prev, activeKey]))
  }, [activeKey])

  return (
    <>
      {seen.map((k) => (
        <img
          key={k}
          src={srcs[k]}
          alt=""
          draggable={false}
          className={`h-full w-full object-cover scene-crossfade ${blend ? 'mix-blend-screen' : ''} ${className}`}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: k === activeKey ? 1 : 0,
          }}
        />
      ))}
    </>
  )
}
