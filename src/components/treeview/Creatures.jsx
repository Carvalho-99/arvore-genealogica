import { useMemo } from 'react'

const base = import.meta.env.BASE_URL
const BUTTERFLY_COUNT = 12
const FIREFLY_COUNT = 18

function scatter(count, seedA, seedB) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 8 + ((i * seedA) % 84),
    top: 12 + ((i * seedB) % 62),
    size: 30 + ((i * 13) % 20),
    dur: 9 + ((i * 5) % 10),
    delay: -1 * ((i * 8) % 12),
    driftX: (i % 2 === 0 ? 1 : -1) * (18 + ((i * 11) % 26)),
    driftY: (i % 3 === 0 ? 1 : -1) * (10 + ((i * 7) % 16)),
  }))
}

export default function Creatures({ period }) {
  const showButterflies = period === 'dia' || period === 'amanhecer' || period === 'por_do_sol'
  const showFireflies = period === 'noite'

  const butterflies = useMemo(() => scatter(7, 137, 59), [])
  const fireflies = useMemo(() => scatter(9, 97, 61), [])

  if (showButterflies) {
    return (
      <div className="creature-layer" aria-hidden="true">
        {butterflies.map((c) => (
          <img
            key={c.id}
            src={`${base}images/creatures/butterfly-${String(1 + (c.id % BUTTERFLY_COUNT)).padStart(2, '0')}.png`}
            alt=""
            className="creature butterfly-flutter"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: c.size,
              '--dur': `${c.dur}s`,
              animationDelay: `${c.delay}s`,
              '--dx': `${c.driftX}px`,
              '--dy': `${c.driftY}px`,
            }}
          />
        ))}
      </div>
    )
  }

  if (showFireflies) {
    return (
      <div className="creature-layer" aria-hidden="true">
        {fireflies.map((c) => (
          <img
            key={c.id}
            src={`${base}images/creatures/firefly-${String(1 + (c.id % FIREFLY_COUNT)).padStart(2, '0')}.png`}
            alt=""
            className="creature firefly-drift"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: c.size * 0.6,
              '--dur': `${c.dur + 4}s`,
              animationDelay: `${c.delay}s`,
              '--dx': `${c.driftX}px`,
              '--dy': `${c.driftY}px`,
            }}
          />
        ))}
      </div>
    )
  }

  return null
}
