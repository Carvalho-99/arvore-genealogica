export default function TreeConnectors({ edges, width, height }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="branchShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      {edges.map((edge, i) =>
        edge.type === 'spouse' ? (
          <line
            key={i}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#d3ab63"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.8}
          />
        ) : (
          <g key={i} filter="url(#branchShadow)">
            <path
              d={branchPath(edge)}
              fill="none"
              stroke="#3d2a15"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.6}
            />
            <path
              d={branchPath(edge)}
              fill="none"
              stroke="#8a6338"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.55}
            />
            <path
              d={branchPath(edge)}
              fill="none"
              stroke="#caa66c"
              strokeWidth={1.1}
              strokeLinecap="round"
              opacity={0.4}
              transform="translate(-1,-1)"
            />
          </g>
        )
      )}
    </svg>
  )
}

function branchPath({ x1, y1, x2, y2 }) {
  const midY = (y1 + y2) / 2
  return `M ${x1} ${y1 + 34} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 40}`
}
