import { Line, QuadraticBezierLine } from '@react-three/drei'
import PersonNode3D from './PersonNode3D'

export default function TreeScene({ nodes, edges, onSelect }) {
  const minY = nodes.reduce((min, n) => Math.min(min, n.y), 0)

  return (
    <group>
      {/* tronco decorativo, só pra ancorar visualmente a base da árvore */}
      <mesh position={[0, (minY - 1.2) / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.32, Math.abs(minY - 1.2) + 0.4, 8]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.9} />
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
            color="#8a6a45"
            lineWidth={1.5}
          />
        ) : (
          <Line
            key={i}
            points={[
              [edge.from.x, edge.from.y, edge.from.z],
              [edge.to.x, edge.to.y, edge.to.z],
            ]}
            color="#c98fa0"
            lineWidth={1.5}
            dashed
            dashScale={8}
          />
        )
      )}

      {nodes.map((node) => (
        <PersonNode3D key={node.id} node={node} onSelect={onSelect} />
      ))}
    </group>
  )
}
