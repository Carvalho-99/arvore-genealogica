import { useState } from 'react'
import Modal from '../common/Modal'
import PersonPicker from './PersonPicker'
import PersonForm from './PersonForm'
import { usePeople } from '../../context/PeopleContext'
import {
  linkSpouses,
  setParents,
  unlinkSpouses,
} from '../../services/firestore/peopleService'

const titles = {
  parents: 'Pais',
  spouses: 'Cônjuge',
  children: 'Filhos',
  siblings: 'Irmãos',
}

export default function RelationshipModal({
  relationType,
  focusedPersonId,
  onClose,
  onNavigate,
}) {
  const { getPerson, getParents, getSpouses, getChildren, getSiblings } =
    usePeople()
  const [showPicker, setShowPicker] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const focused = getPerson(focusedPersonId)
  const linked =
    relationType === 'parents'
      ? getParents(focusedPersonId)
      : relationType === 'spouses'
        ? getSpouses(focusedPersonId)
        : relationType === 'children'
          ? getChildren(focusedPersonId)
          : getSiblings(focusedPersonId)

  const canUnlink = relationType !== 'siblings'
  const excludeIds = [focusedPersonId, ...linked.map((p) => p.id)]

  async function handleUnlink(targetId) {
    if (relationType === 'parents') {
      const remaining = (focused?.parentIds ?? []).filter((id) => id !== targetId)
      await setParents(focusedPersonId, remaining)
    } else if (relationType === 'spouses') {
      await unlinkSpouses(focusedPersonId, targetId)
    } else if (relationType === 'children') {
      const child = getPerson(targetId)
      const remaining = (child?.parentIds ?? []).filter((id) => id !== focusedPersonId)
      await setParents(targetId, remaining)
    }
  }

  async function handleLinkExisting(selectedId) {
    if (relationType === 'parents') {
      await setParents(focusedPersonId, [...(focused?.parentIds ?? []), selectedId])
    } else if (relationType === 'spouses') {
      await linkSpouses(focusedPersonId, selectedId)
    } else if (relationType === 'children') {
      const child = getPerson(selectedId)
      const already = child?.parentIds ?? []
      if (!already.includes(focusedPersonId)) {
        await setParents(selectedId, [...already, focusedPersonId])
      }
    } else if (relationType === 'siblings') {
      const sibling = getPerson(selectedId)
      if ((sibling?.parentIds ?? []).length > 0) {
        const ok = window.confirm(
          `${sibling.fullName} já tem pai/mãe cadastrado. Substituir pelos pais de ${focused?.fullName}?`
        )
        if (!ok) return
      }
      await setParents(selectedId, focused?.parentIds ?? [])
    }
    setShowPicker(false)
  }

  if (showForm) {
    return (
      <PersonForm
        linkContext={{ focusedPersonId, relationType }}
        onClose={() => setShowForm(false)}
        onSaved={() => setShowForm(false)}
      />
    )
  }

  if (showPicker) {
    return (
      <PersonPicker
        title={`Vincular ${titles[relationType].toLowerCase()} existente`}
        excludeIds={excludeIds}
        onSelect={handleLinkExisting}
        onClose={() => setShowPicker(false)}
      />
    )
  }

  return (
    <Modal title={titles[relationType]} onClose={onClose}>
      <div className="mb-3 space-y-1">
        {linked.length === 0 && (
          <p className="py-2 text-center text-sm text-stone-400">
            Ninguém vinculado ainda.
          </p>
        )}
        {linked.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg px-1 py-1.5"
          >
            <button
              onClick={() => {
                onNavigate(p.id)
                onClose()
              }}
              className="flex-1 rounded-lg px-2 py-1.5 text-left text-sm text-stone-700 active:bg-stone-100 dark:text-stone-200 dark:active:bg-stone-700"
            >
              {p.fullName}
            </button>
            {canUnlink && (
              <button
                onClick={() => handleUnlink(p.id)}
                className="px-2 text-xs text-stone-400 active:text-red-500"
              >
                remover
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowForm(true)}
          className="flex-1 rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white active:bg-stone-700 dark:bg-stone-100 dark:text-stone-900"
        >
          + Adicionar novo
        </button>
        <button
          onClick={() => setShowPicker(true)}
          className="flex-1 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-700 active:bg-stone-200 dark:bg-stone-700 dark:text-stone-200"
        >
          🔗 Vincular existente
        </button>
      </div>
    </Modal>
  )
}
