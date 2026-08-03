import { useState } from 'react'
import { Text } from '@react-three/drei'

const colorByGender = {
  F: '#f472b6',
  M: '#38bdf8',
  other: '#fbbf24',
}

export default function PersonNode3D({ node, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const { person, x, y, z } = node
  const color = colorByGender[person.gender] ?? colorByGender.other
  const scale = person.isRoot ? 1.5 : hovered ? 1.25 : 1

  return (
    <group position={[x, y, z]}>
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
          emissive={person.isRoot ? '#fde68a' : color}
          emissiveIntensity={person.isRoot ? 0.9 : 0.5}
          roughness={0.35}
        />
      </mesh>
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.22}
        color="#e2f4ff"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.015}
        outlineColor="#020306"
      >
        {person.nickname || person.fullName}
      </Text>
    </group>
  )
}
