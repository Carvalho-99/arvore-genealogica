import { useState } from 'react'
import { Text } from '@react-three/drei'

const colorByGender = {
  F: '#c98fa0',
  M: '#8b5e34',
  other: '#6b8e4e',
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
          emissive={person.isRoot ? '#8fae55' : '#000000'}
          emissiveIntensity={person.isRoot ? 0.35 : 0}
          roughness={0.55}
        />
      </mesh>
      <Text
        position={[0, -0.55, 0]}
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
