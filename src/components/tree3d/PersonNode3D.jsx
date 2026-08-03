import { useMemo, useState } from 'react'
import { Text } from '@react-three/drei'

const colorByGender = {
  F: '#c98fa0',
  M: '#8b5e34',
  other: '#6b8e4e',
}

const leafGreens = ['#5c7a3d', '#729a4a', '#8ba85f']

// hash simples e determinístico a partir do id, só pra espalhar as
// folhinhas ao redor de cada pessoa sempre do mesmo jeito (sem
// recalcular posição aleatória a cada render)
function seededOffsets(id) {
  let seed = 0
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) % 10000
  const rand = (n) => {
    const v = Math.sin(seed + n * 12.9898) * 43758.5453
    return v - Math.floor(v)
  }
  return Array.from({ length: 3 }, (_, i) => ({
    x: (rand(i) - 0.5) * 0.5,
    y: (rand(i + 10) - 0.5) * 0.4,
    z: (rand(i + 20) - 0.5) * 0.5,
    scale: 0.16 + rand(i + 30) * 0.1,
    color: leafGreens[i % leafGreens.length],
  }))
}

export default function PersonNode3D({ node, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const { person, x, y, z } = node
  const color = colorByGender[person.gender] ?? colorByGender.other
  const scale = person.isRoot ? 1.5 : hovered ? 1.25 : 1
  const leaves = useMemo(() => seededOffsets(person.id), [person.id])

  return (
    <group position={[x, y, z]}>
      {leaves.map((leaf, i) => (
        <mesh key={i} position={[leaf.x, leaf.y, leaf.z]} scale={leaf.scale}>
          <sphereGeometry args={[0.32, 6, 6]} />
          <meshStandardMaterial color={leaf.color} roughness={0.8} />
        </mesh>
      ))}
      <mesh
        scale={scale}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(person.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={person.isRoot ? '#8fae55' : '#000000'}
          emissiveIntensity={person.isRoot ? 0.35 : 0}
          roughness={0.55}
        />
      </mesh>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.22}
        color="#3f2f1c"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.012}
        outlineColor="#f6ecd2"
      >
        {person.nickname || person.fullName}
      </Text>
    </group>
  )
}
