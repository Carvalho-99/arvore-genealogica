import { useMemo } from 'react'

const LEAF_COUNT = 12
const base = import.meta.env.BASE_URL

// Folhas caindo devagar o tempo todo, fixas na viewport (não fazem parte do
// mundo pan/zoom) — só pra dar sensação de ambiente vivo, sem interação.
export default function AmbientLeaves({ count = 7 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        leafNum: String(1 + ((i * 3 + 2) % LEAF_COUNT)).padStart(2, '0'),
        left: 4 + ((i * 137) % 92),
        size: 20 + ((i * 53) % 22),
        dur: 22 + ((i * 7) % 18),
        delay: -1 * ((i * 11) % 30),
        driftA: (i % 2 === 0 ? 1 : -1) * (30 + ((i * 17) % 60)),
        driftB: (i % 2 === 0 ? -1 : 1) * (20 + ((i * 23) % 50)),
        spin: 180 + ((i * 41) % 360),
      })),
    [count]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {leaves.map((leaf) => (
        <img
          key={leaf.id}
          src={`${base}leaves/leaf-${leaf.leafNum}.png`}
          alt=""
          className="ambient-leaf"
          style={{
            left: `${leaf.left}%`,
            width: leaf.size,
            '--dur': `${leaf.dur}s`,
            '--delay': `${leaf.delay}s`,
            '--driftA': `${leaf.driftA}px`,
            '--driftB': `${leaf.driftB}px`,
            '--spinA': `${leaf.spin}deg`,
            '--spinB': `${-leaf.spin}deg`,
            '--spinC': `${leaf.spin * 2}deg`,
          }}
        />
      ))}
    </div>
  )
}
