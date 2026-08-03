import { Line, QuadraticBezierLine } from '@react-three/drei'
import PersonNode3D from './PersonNode3D'
import FallingLeaves from './FallingLeaves'

export default function TreeScene({ nodes, edges, onSelect, leavesRef }) {
  const minY = nodes.reduce((min, n) => Math.min(min, n.y), 0)

  function handleBackgroundClick(e) {
    e.stopPropagation()
    const p = e.point
    leavesRef.current?.burst([p.x, p.y, p.z])
  }

  return (
    <group onClick={handleBackgroundClick}>
      {/* tronco decorativo, só pra ancorar visualmente a base da árvore */}
      <mesh position={[0, (minY - 1.2) / 2, 0]}>
        <cylinderGeometry args={[0.16, 0.3, Math.abs(minY - 1.2) + 0.4, 8]} />
        <meshStandardMaterial color="#5a3d24" roughness={0.85} />
      </mesh>

      {edges.map((edge, i) =>
        edge.type === 'parent' ? (
          <QuadraticBezierLine
            key={i}
            start={[edge.from.x, edge.from.y, edge.from.z]}
            end={[edge.to.x, edge.to.y, edge.to.z]}
            mid={[
              (edge.from.x + edge.to.x) / 2,
              (edge.from.y + edge.to.y) / 2,
              (edge.from.z + edge.to.z) / 2 + 0.6,
            ]}
            color="#6b4a2f"
            lineWidth={2}
          />
        ) : (
          <Line
            key={i}
            points={[
              [edge.from.x, edge.from.y, edge.from.z],
              [edge.to.x, edge.to.y, edge.to.z],
            ]}
            color="#a8763f"
            lineWidth={1.5}
          />
        )
      )}

      {nodes.map((node) => (
        <PersonNode3D key={node.id} node={node} onSelect={onSelect} />
      ))}

      <FallingLeaves ref={leavesRef} />
    </group>
  )
}
