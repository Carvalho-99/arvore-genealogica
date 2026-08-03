const foliage = [
  { cx: 150, cy: 260, rx: 90, ry: 60, color: '#5c7a3d', delay: 0 },
  { cx: 260, cy: 220, rx: 80, ry: 55, color: '#729a4a', delay: 0.6 },
  { cx: 200, cy: 180, rx: 95, ry: 65, color: '#4f6b35', delay: 1.2 },
  { cx: 110, cy: 190, rx: 60, ry: 45, color: '#7fa855', delay: 1.8 },
  { cx: 300, cy: 270, rx: 55, ry: 40, color: '#6a8f47', delay: 2.4 },
]

export default function AppBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 20%, #f6ecd2 0%, #e8d9ab 45%, #cdb37c 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 760"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full opacity-60"
      >
        <defs>
          <filter id="softBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {/* tronco decorativo, bem discreto */}
        <path
          d="M188,760 C185,600 190,480 198,400 C204,340 196,300 200,260 C203,230 197,210 200,190 L212,190 C214,210 208,230 210,260 C213,300 206,340 212,400 C219,480 214,600 212,760 Z"
          fill="#6b4a2f"
          opacity="0.35"
        />

        {foliage.map((f, i) => (
          <ellipse
            key={i}
            cx={f.cx}
            cy={f.cy}
            rx={f.rx}
            ry={f.ry}
            fill={f.color}
            opacity="0.4"
            filter="url(#softBlur)"
            className="sway-leaf"
            style={{ animationDelay: `${f.delay}s`, transformOrigin: `${f.cx}px ${f.cy}px` }}
          />
        ))}
      </svg>
    </div>
  )
}
