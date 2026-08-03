const branches = [
  'M200,700 Q195,600 200,480',
  'M200,480 Q160,440 120,380',
  'M120,380 Q95,340 70,300',
  'M120,380 Q110,330 100,270',
  'M200,480 Q175,420 150,340',
  'M150,340 Q130,290 110,240',
  'M150,340 Q160,280 170,220',
  'M200,480 Q200,420 200,340',
  'M200,340 Q180,280 165,210',
  'M200,340 Q220,280 235,210',
  'M200,340 Q200,260 200,180',
  'M200,480 Q225,420 250,340',
  'M250,340 Q270,280 290,220',
  'M250,340 Q240,290 230,240',
  'M200,480 Q240,440 280,380',
  'M280,380 Q305,340 330,300',
  'M280,380 Q290,330 300,270',
  'M200,700 Q170,720 140,745',
  'M200,700 Q230,720 260,745',
]

const nodes = [
  [70, 300], [100, 270], [110, 240], [170, 220],
  [165, 210], [200, 180], [235, 210], [230, 240],
  [290, 220], [330, 300], [300, 270],
]

const stars = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 137) % 400,
  y: (i * 251) % 700,
  r: 0.6 + ((i * 37) % 10) / 10,
  delay: (i % 7) * 0.4,
}))

export default function HolographicBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 15%, #10192e 0%, #060a15 55%, #020306 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 760"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full opacity-80"
      >
        <defs>
          <linearGradient id="branchGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="holoGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#7dd3fc"
            className="holo-star"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}

        <g filter="url(#holoGlow)">
          {branches.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="url(#branchGrad)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="8 7"
              className="holo-branch"
              style={{ animationDelay: `${(i % 5) * 0.5}s` }}
            />
          ))}
          {nodes.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4.5}
              fill="#fde68a"
              className="holo-node"
              style={{ animationDelay: `${(i % 6) * 0.4}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
