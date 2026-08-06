import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { computeSimpleListTree } from '../../lib/simpleListLayout'
import {
  createSimpleListPerson,
  deleteSimpleListPerson,
  subscribeToSimpleList,
} from '../../services/firestore/simpleListService'
import PeopleMultiSelect from '../treeview/PeopleMultiSelect'
import LoadingSpinner from '../common/LoadingSpinner'

export default function SimpleListPage() {
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToSimpleList(
      (list) => {
        setPeople(list)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsubscribe
  }, [])

  const generations = useMemo(() => computeSimpleListTree(people), [people])

  return (
    <div className="min-h-svh bg-[#0b0902] text-amber-50/90" style={{ fontFamily: 'monospace' }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-amber-100/10 bg-[#0b0902]/95 px-4 backdrop-blur-sm"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: '12px' }}
      >
        <button onClick={() => navigate('/arvore')} className="text-amber-100/70" aria-label="Voltar pra árvore">
          ← voltar
        </button>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6 pb-28">
        <h1 className="mb-1 text-center text-sm font-bold tracking-wide text-amber-50">
          ÁRVORE GENEALÓGICA DA FAMÍLIA
        </h1>
        <p className="mb-6 text-center text-xs text-amber-100/40">
          lista simples, separada da árvore visual
        </p>

        {loading && <LoadingSpinner />}

        {!loading && people.length === 0 && (
          <p className="py-10 text-center text-sm text-amber-100/40">
            Nenhum nome cadastrado ainda.
          </p>
        )}

        {generations.map(({ gen, blocks }) => (
          <div key={gen} className="mb-8">
            <div className="mb-3 text-xs text-amber-100/50">
              {'═'.repeat(15)}
              <br />
              GERAÇÃO {gen}
              <br />
              {'═'.repeat(15)}
            </div>
            {blocks.map((block, i) => (
              <Block key={i} block={block} onDelete={setDeletingId} />
            ))}
          </div>
        ))}

        {adding ? (
          <AddPersonForm people={people} onClose={() => setAdding(false)} />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-4 w-full rounded-lg border border-amber-100/20 py-3 text-sm text-amber-100/80"
          >
            + adicionar pessoa
          </button>
        )}
      </div>
    </div>
  )

  function setDeletingId(id, name) {
    if (window.confirm(`Remover ${name} da lista?`)) deleteSimpleListPerson(id)
  }
}

function Block({ block, onDelete }) {
  const { members, children } = block
  return (
    <div className="mb-6 text-sm leading-relaxed">
      {members.map((m, i) => (
        <div key={m.id} className="flex items-center gap-2">
          <span>
            {m.isPrincipal && '⭐ '}
            {m.fullName}
          </span>
          <button onClick={() => onDelete(m.id, m.fullName)} className="text-xs text-amber-100/25 hover:text-red-300">
            ×
          </button>
          {i === 0 && members.length > 1 && <span className="text-amber-100/40">♥</span>}
        </div>
      ))}
      {children.length > 0 && (
        <div className="mt-1">
          <div className="text-amber-100/40">│</div>
          {children.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="text-amber-100/40">{i === children.length - 1 ? '└── ' : '├── '}</span>
              <span>
                {c.isPrincipal && '⭐ '}
                {c.fullName}
              </span>
              <button onClick={() => onDelete(c.id, c.fullName)} className="text-xs text-amber-100/25 hover:text-red-300">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddPersonForm({ people, onClose }) {
  const [fullName, setFullName] = useState('')
  const [parentIds, setParentIds] = useState([])
  const [spouseIds, setSpouseIds] = useState([])
  const [isPrincipal, setIsPrincipal] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fullName.trim()) return
    setSaving(true)
    try {
      await createSimpleListPerson({ fullName: fullName.trim(), parentIds, spouseIds, isPrincipal })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-amber-100/15 p-4">
      <div>
        <label className="mb-1 block text-xs text-amber-100/50">Nome completo</label>
        <input
          autoFocus
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded border border-amber-100/20 bg-transparent px-3 py-2 text-sm text-amber-50 outline-none"
        />
      </div>

      <PeopleMultiSelect label="Pai / Mãe (opcional)" selectedIds={parentIds} onChange={setParentIds} allPeople={people} />
      <PeopleMultiSelect label="Cônjuge (opcional)" selectedIds={spouseIds} onChange={setSpouseIds} allPeople={people} />

      <label className="flex items-center gap-2 text-xs text-amber-100/70">
        <input type="checkbox" checked={isPrincipal} onChange={(e) => setIsPrincipal(e.target.checked)} />
        Esta é a pessoa principal (⭐)
      </label>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 rounded border border-amber-100/15 py-2 text-sm text-amber-100/60">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="flex-1 rounded border border-amber-100/30 py-2 text-sm text-amber-50">
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
