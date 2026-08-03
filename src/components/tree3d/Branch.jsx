import { useMemo } from 'react'
import * as THREE from 'three'

export default function Branch({ from, to, radius = 0.05, color = '#6b4a2f', curveOut = 0.6 }) {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3(from.x, from.y, from.z)
    const end = new THREE.Vector3(to.x, to.y, to.z)
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2,
      (from.y + to.y) / 2,
      (from.z + to.z) / 2 + curveOut
    )
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    return new THREE.TubeGeometry(curve, 12, radius, 6, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.x, from.y, from.z, to.x, to.y, to.z, radius, curveOut])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}
