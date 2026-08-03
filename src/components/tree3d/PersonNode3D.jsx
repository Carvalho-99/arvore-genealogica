import { useState } from 'react'
import { Text } from '@react-three/drei'

const colorByGender = {
  F: '#d97a91',
  M: '#5b8fa8',
  other: '#c9973f',
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
          emissive={person.isRoot ? '#e8c874' : '#000000'}
          emissiveIntensity={person.isRoot ? 0.4 : 0}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.22}
        color="#3f2f1c"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.012}
        outlineColor="#fdf6e3"
      >
        {person.nickname || person.fullName}
      </Text>
    </group>
  )
}
