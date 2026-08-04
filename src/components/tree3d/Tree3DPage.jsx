import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../../context/PeopleContext'
import { computeGenerations } from './layout'
import { CANOPY_SLOTS, TRUNK_SLOT } from './treeFrameSlots'
import LoadingSpinner from '../common/LoadingSpinner'

const leafColors = ['#5c7a3d', '#729a4a', '#8ba85f', '#8b6b3d', '#c2a35a']
let leafId = 0

export default function Tree3DPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([])

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
  }, [people, rootPerson])

  function handleImageClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100
    const batch = Array.from({ length: 10 }, () => ({
      id: leafId++,
      x: xPct + (Math.random() - 0.5) * 8,
      y: yPct,
      delay: Math.random() * 0.15,
      dur: 1.5 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 70,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }))
    setLeaves((l) => [...l, ...batch])
    setTimeout(() => {
      setLeaves((l) => l.filter((leaf) => !batch.includes(leaf)))
    }, 2600)
  }

  if (loading) return <LoadingSpinner />

  if (!rootPerson) {
    return (
      <div className="mt-16 text-center text-sm text-stone-500">
        Cadastre pelo menos uma pessoa na aba Árvore pra ver a árvore ilustrada.
      </div>
    )
  }

  return (
    <div
      className="relative w-full select-none overflow-hidden rounded-2xl border border-amber-800/15 shadow-sm"
      onClick={handleImageClick}
    >
      <img
        src={`${import.meta.env.BASE_URL}tree-faces/front.jpg`}
        alt="Árvore da família"
        className="block w-full"
        draggable={false}
      />

      {labels.map(({ person, slot, big }) => (
        <button
          key={person.id}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/pessoa/${person.id}`)
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-medium leading-tight text-[#3f2f1c] [text-shadow:0_1px_3px_rgba(246,236,210,0.95)]"
          style={{
            left: `${slot.x}%`,
            top: `${slot.y}%`,
            fontSize: big ? '16px' : '10.5px',
            maxWidth: big ? '55%' : '27%',
          }}
        >
          {person.nickname || person.fullName}
        </button>
      ))}

      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="leaf-particle"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            background: leaf.color,
            '--drift': `${leaf.drift}px`,
            '--dur': `${leaf.dur}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
