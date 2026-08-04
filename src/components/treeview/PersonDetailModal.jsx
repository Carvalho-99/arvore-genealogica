import { useState } from 'react'
import { usePeople } from '../../context/PeopleContext'
import { deletePerson } from '../../services/firestore/peopleService'
import { lifespan } from '../../utils/dateFormat'
import PersonFormModal from './PersonFormModal'

const genderIcon = { F: '♀', M: '♂', other: '✦' }

export default function PersonDetailModal({ person, onClose, onNavigate }) {
  const { getParents, getSpouses, getChildren, getSiblings } = usePeople()
  const [editing, setEditing] = useState(false)

  const span = lifespan(person.birthDate, person.deathDate)
  const relations = [
    { label: 'Pais', people: getParents(person.id) },
    { label: 'Cônjuge', people: getSpouses(person.id) },
    { label: 'Filhos', people: getChildren(person.id) },
    { label: 'Irmãos', people: getSiblings(person.id) },
  ].filter((r) => r.people.length > 0)

  async function handleDelete() {
    if (!window.confirm(`Remover ${person.fullName} da árvore?`)) return
    await deletePerson(person.id)
    onClose()
  }

  if (editing) {
    return (
      <PersonFormModal
        person={person}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false)
          onClose()
        }}
      />
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>

        {person.photoUrl ? (
          <img src={person.photoUrl} alt="" className="detail-photo" />
        ) : (
          <div className="detail-photo detail-photo-placeholder">{genderIcon[person.gender] ?? '✦'}</div>
        )}

        <h2 className="font-serif-display text-center text-2xl text-amber-50">{person.fullName}</h2>
        {person.nickname && <p className="text-center text-sm italic text-amber-100/60">"{person.nickname}"</p>}
        {span && <p className="mt-1 text-center text-sm tracking-wide text-amber-100/80">{span}</p>}
        {person.birthPlace && <p className="text-center text-xs text-amber-100/50">{person.birthPlace}</p>}

        {person.bio && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-amber-50/85">{person.bio}</p>
        )}

        {relations.length > 0 && (
          <div className="mt-5 space-y-3">
            {relations.map((rel) => (
              <div key={rel.label}>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-amber-200/50">
                  {rel.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rel.people.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigate(p.id)
                        onClose()
                      }}
                      className="relation-chip"
                    >
                      {p.nickname || p.fullName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => setEditing(true)} className="btn-gold-outline">
            Editar
          </button>
          <button onClick={handleDelete} className="btn-danger-outline">
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
