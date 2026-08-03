import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePeople } from '../../context/PeopleContext'
import { deletePerson } from '../../services/firestore/peopleService'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import Modal from '../common/Modal'
import PersonCard from './PersonCard'
import RelationshipNav from './RelationshipNav'
import RelationshipModal from './RelationshipModal'
import PersonForm from './PersonForm'
import PersonListView from './PersonListView'

const quickAddOptions = [
  { type: 'parents', label: '⬆️ Pai/Mãe' },
  { type: 'spouses', label: '💍 Cônjuge' },
  { type: 'children', label: '⬇️ Filho(a)' },
  { type: 'siblings', label: '↔️ Irmão(ã)' },
]

export default function TreeBuilderPage() {
  const { personId } = useParams()
  const navigate = useNavigate()
  const {
    people,
    loading,
    error,
    rootPerson,
    getPerson,
    getParents,
    getSpouses,
    getChildren,
    getSiblings,
  } = usePeople()

  const [openRelation, setOpenRelation] = useState(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showListView, setShowListView] = useState(false)
  const [quickAddRelation, setQuickAddRelation] = useState(null)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage>Não deu pra carregar a árvore.</ErrorMessage>

  if (people.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="mb-4 text-slate-400">
          A árvore ainda está vazia. Comece cadastrando a primeira pessoa.
        </p>
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-amber-300 px-5 py-3 text-sm font-medium text-slate-950"
        >
          Adicionar primeira pessoa
        </button>
        {editing && (
          <PersonForm onClose={() => setEditing(false)} onSaved={() => setEditing(false)} />
        )}
      </div>
    )
  }

  const focused = getPerson(personId) ?? rootPerson

  const counts = {
    parents: getParents(focused.id).length,
    spouses: getSpouses(focused.id).length,
    children: getChildren(focused.id).length,
    siblings: getSiblings(focused.id).length,
  }

  async function handleDelete() {
    const ok = window.confirm(`Excluir ${focused.fullName} da árvore?`)
    if (!ok) return
    await deletePerson(focused.id)
    navigate('/')
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => rootPerson && navigate(`/pessoa/${rootPerson.id}`)}
          className="rounded-full px-2 py-1 text-xl text-slate-300 active:bg-slate-800"
          aria-label="Ir para o início"
        >
          🏠
        </button>
        <button
          onClick={() => setShowListView(true)}
          className="rounded-full px-2 py-1 text-xl text-slate-300 active:bg-slate-800"
          aria-label="Buscar pessoa"
        >
          🔍
        </button>
      </div>

      <PersonCard
        person={focused}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <RelationshipNav counts={counts} onOpen={setOpenRelation} />

      <button
        onClick={() => setQuickAddOpen(true)}
        className="fixed bottom-20 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-amber-300 text-2xl text-slate-950 shadow-[0_0_25px_-4px_rgba(34,211,238,0.6)]"
        aria-label="Adicionar pessoa"
      >
        +
      </button>

      {openRelation && (
        <RelationshipModal
          relationType={openRelation}
          focusedPersonId={focused.id}
          onClose={() => setOpenRelation(null)}
          onNavigate={(id) => navigate(`/pessoa/${id}`)}
        />
      )}

      {editing && (
        <PersonForm
          person={focused}
          onClose={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      )}

      {showListView && (
        <PersonListView
          onSelect={(id) => navigate(`/pessoa/${id}`)}
          onClose={() => setShowListView(false)}
        />
      )}

      {quickAddOpen && !quickAddRelation && (
        <Modal title="Adicionar pessoa vinculada" onClose={() => setQuickAddOpen(false)}>
          <div className="grid grid-cols-2 gap-2">
            {quickAddOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setQuickAddRelation(opt.type)}
                className="rounded-lg border border-cyan-400/15 bg-slate-800/80 py-3 text-sm font-medium text-cyan-200 active:bg-slate-700"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {quickAddOpen && quickAddRelation && (
        <PersonForm
          linkContext={{ focusedPersonId: focused.id, relationType: quickAddRelation }}
          onClose={() => {
            setQuickAddOpen(false)
            setQuickAddRelation(null)
          }}
          onSaved={() => {
            setQuickAddOpen(false)
            setQuickAddRelation(null)
          }}
        />
      )}
    </div>
  )
}
