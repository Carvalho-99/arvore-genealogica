import { useMemo } from 'react'

// Poeira/pólen flutuando bem devagar na luz — camada mais "próxima da
// câmera", então é a que mais se move no parallax passivo do mouse.
export default function DustParticles({ count = 16 }) {
  const dust = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 61.8) % 100,
        top: 15 + ((i * 37) % 70),
        size: 2 + ((i * 5) % 4),
        dur: 10 + ((i * 3) % 14),
        delay: -1 * ((i * 7) % 20),
      })),
    [count]
  )

  return (
    <div className="dust-layer" aria-hidden="true">
      {dust.map((d) => (
        <span
          key={d.id}
          className="dust-mote"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            '--dur': `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
