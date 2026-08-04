import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../../context/PeopleContext'
import { computeGenerations } from './layout'
import { CANOPY_SLOTS, TRUNK_SLOT } from './treeFrameSlots'
import LoadingSpinner from '../common/LoadingSpinner'

const LEAF_COUNT = 22
let leafId = 0

export default function Tree3DPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([])
  const base = import.meta.env.BASE_URL

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
    const batch = Array.from({ length: 9 }, () => ({
      id: leafId++,
      x: xPct + (Math.random() - 0.5) * 8,
      y: yPct,
      delay: Math.random() * 0.15,
      dur: 1.6 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 80,
      spin: (Math.random() - 0.5) * 540,
      leafNum: String(1 + Math.floor(Math.random() * LEAF_COUNT)).padStart(2, '0'),
    }))
    setLeaves((l) => [...l, ...batch])
    setTimeout(() => {
      setLeaves((l) => l.filter((leaf) => !batch.includes(leaf)))
    }, 2800)
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
    <div className="w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-amber-800/15 shadow-sm">
    <div
      className="relative select-none"
      style={{ width: 760 }}
      onClick={handleImageClick}
    >
      <img
        src={`${base}tree.jpg`}
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
            fontSize: big ? '19px' : '11.5px',
            maxWidth: big ? '46%' : '15%',
          }}
        >
          {person.nickname || person.fullName}
        </button>
      ))}

      {leaves.map((leaf) => (
        <img
          key={leaf.id}
          src={`${base}leaves/leaf-${leaf.leafNum}.png`}
          alt=""
          className="leaf-particle"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            '--drift': `${leaf.drift}px`,
            '--spin': `${leaf.spin}deg`,
            '--dur': `${leaf.dur}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        />
      ))}
    </div>
    </div>
  )
}
