import PersonNode3D from './PersonNode3D'
import FallingLeaves from './FallingLeaves'
import Branch from './Branch'

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
          <Branch
            key={i}
            from={edge.from}
            to={edge.to}
            radius={0.055}
            color="#5f3f26"
          />
        ) : (
          <Branch
            key={i}
            from={edge.from}
            to={edge.to}
            radius={0.03}
            color="#a8763f"
            curveOut={0.15}
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
