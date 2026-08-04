export default function TreeConnectors({ edges, width, height }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {edges.map((edge, i) =>
        edge.type === 'spouse' ? (
          <line
            key={i}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#caa25c"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.75}
          />
        ) : (
          <path
            key={i}
            d={branchPath(edge)}
            fill="none"
            stroke="#5b4022"
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.65}
          />
        )
      )}
    </svg>
  )
}

function branchPath({ x1, y1, x2, y2 }) {
  const midY = (y1 + y2) / 2
  return `M ${x1} ${y1 + 34} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 40}`
}
