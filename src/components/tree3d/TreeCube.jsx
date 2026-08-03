import { useMemo, useRef } from 'react'
import { useTexture, Text } from '@react-three/drei'
import { computeGenerations } from './layout'
import { CANOPY_SLOTS, TRUNK_SLOT } from './treeFrameSlots'
import FallingLeaves from './FallingLeaves'

const SIZE = 3.8

function slotToLocal(slot) {
  return [
    (slot.x / 100 - 0.5) * SIZE,
    (0.5 - slot.y / 100) * SIZE,
    SIZE / 2 + 0.02,
  ]
}

export default function TreeCube({ people, rootPerson, onSelect }) {
  const leavesRef = useRef()
  const base = import.meta.env.BASE_URL
  const [front, back, left, right] = useTexture([
    `${base}tree-faces/front.jpg`,
    `${base}tree-faces/back.jpg`,
    `${base}tree-faces/left.jpg`,
    `${base}tree-faces/right.jpg`,
  ])

  const labels = useMemo(() => {
    if (!rootPerson) return []
    const generations = computeGenerations(people, rootPerson.id)
    const others = people
      .filter((p) => p.id !== rootPerson.id && generations.has(p.id))
      .sort((a, b) => Math.abs(generations.get(a.id)) - Math.abs(generations.get(b.id)))

    const items = [{ person: rootPerson, slot: TRUNK_SLOT, big: true }]
    others.forEach((person, i) => {
      const slot = CANOPY_SLOTS[i]
      if (slot) items.push({ person, slot, big: false })
    })
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people, rootPerson])

  function handleBoxClick(e) {
    e.stopPropagation()
    const p = e.point
    leavesRef.current?.burst([p.x, p.y, p.z + 0.3])
  }

  return (
    <group onClick={handleBoxClick}>
      <mesh>
        <boxGeometry args={[SIZE, SIZE, SIZE]} />
        <meshStandardMaterial attach="material-0" map={right} roughness={0.9} />
        <meshStandardMaterial attach="material-1" map={left} roughness={0.9} />
        <meshStandardMaterial attach="material-2" color="#c9a35a" roughness={0.9} />
        <meshStandardMaterial attach="material-3" color="#3f2f1c" roughness={0.9} />
        <meshStandardMaterial attach="material-4" map={front} roughness={0.9} />
        <meshStandardMaterial attach="material-5" map={back} roughness={0.9} />
      </mesh>

      {labels.map(({ person, slot, big }) => (
        <Text
          key={person.id}
          position={slotToLocal(slot)}
          fontSize={big ? 0.26 : 0.16}
          maxWidth={big ? 1.7 : 0.9}
          textAlign="center"
          color="#3f2f1c"
          outlineWidth={0.014}
          outlineColor="#f3e4bd"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(person.id)
          }}
        >
          {person.nickname || person.fullName}
        </Text>
      ))}

      <FallingLeaves ref={leavesRef} />
    </group>
  )
}
