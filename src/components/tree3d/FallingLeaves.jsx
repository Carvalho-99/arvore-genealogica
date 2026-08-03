import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const POOL_SIZE = 24
const BURST_SIZE = 14
const leafColors = ['#6b8e4e', '#8ba85f', '#a68a4a', '#c2a35a', '#5c7a3d']

const FallingLeaves = forwardRef(function FallingLeaves(_, ref) {
  const meshRefs = useRef([])
  const data = useRef(
    Array.from({ length: POOL_SIZE }, () => ({ active: false }))
  )

  useImperativeHandle(ref, () => ({
    burst(origin) {
      let spawned = 0
      for (let i = 0; i < POOL_SIZE && spawned < BURST_SIZE; i++) {
        const d = data.current[i]
        if (d.active) continue
        const mesh = meshRefs.current[i]
        if (!mesh) continue

        mesh.position.set(
          origin[0] + (Math.random() - 0.5) * 2.4,
          origin[1] + Math.random() * 1.3,
          origin[2] + (Math.random() - 0.5) * 2.4
        )
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
        mesh.material.opacity = 1
        mesh.visible = true

        d.active = true
        d.vy = 0.3 + Math.random() * 0.3
        d.swayPhase = Math.random() * Math.PI * 2
        d.swaySpeed = 0.8 + Math.random() * 1.6
        d.swayAmount = 0.25 + Math.random() * 0.35
        d.rotSpeed = (Math.random() - 0.5) * 2.2
        d.groundY = origin[1] - 4 - Math.random() * 1.5
        spawned++
      }
    },
  }))

  useFrame((_, delta) => {
    for (let i = 0; i < POOL_SIZE; i++) {
      const d = data.current[i]
      if (!d.active) continue
      const mesh = meshRefs.current[i]
      if (!mesh) continue

      d.swayPhase += delta * d.swaySpeed
      mesh.position.y -= d.vy * delta
      mesh.position.x += Math.sin(d.swayPhase) * d.swayAmount * delta
      mesh.rotation.z += d.rotSpeed * delta
      mesh.rotation.x += d.rotSpeed * 0.5 * delta

      if (mesh.position.y < d.groundY) {
        mesh.material.opacity = Math.max(0, mesh.material.opacity - delta * 1.8)
        if (mesh.material.opacity <= 0) {
          d.active = false
          mesh.visible = false
        }
      }
    }
  })

  return (
    <>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} visible={false}>
          <planeGeometry args={[0.16, 0.22]} />
          <meshStandardMaterial
            color={leafColors[i % leafColors.length]}
            side={2}
            transparent
            opacity={1}
            roughness={0.7}
          />
        </mesh>
      ))}
    </>
  )
})

export default FallingLeaves
