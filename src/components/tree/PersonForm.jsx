import { useState } from 'react'
import Modal from '../common/Modal'
import ErrorMessage from '../common/ErrorMessage'
import { usePeople } from '../../context/PeopleContext'
import {
  createPerson,
  linkSpouses,
  setParents,
  updatePerson,
} from '../../services/firestore/peopleService'

const relationTitles = {
  parents: 'Adicionar pai/mãe',
  children: 'Adicionar filho(a)',
  spouses: 'Adicionar cônjuge',
  siblings: 'Adicionar irmão(ã)',
}

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2.5 text-base text-slate-100 outline-none focus:border-cyan-400/60'
const labelClass = 'mb-1 block text-xs font-medium text-slate-400'

export default function PersonForm({ person = null, linkContext = null, onClose, onSaved }) {
  const { getPerson } = usePeople()
  const isEdit = Boolean(person)

  const [fullName, setFullName] = useState(person?.fullName ?? '')
  const [nickname, setNickname] = useState(person?.nickname ?? '')
  const [gender, setGender] = useState(person?.gender ?? 'other')
  const [birthDate, setBirthDate] = useState(person?.birthDate ?? '')
  const [deathDate, setDeathDate] = useState(person?.deathDate ?? '')
  const [birthPlace, setBirthPlace] = useState(person?.birthPlace ?? '')
  const [bio, setBio] = useState(person?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const title = isEdit
    ? 'Editar pessoa'
    : (linkContext && relationTitles[linkContext.relationType]) || 'Adicionar pessoa'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fullName.trim()) return
    setSaving(true)
    setError(null)

    const fields = {
      fullName: fullName.trim(),
      nickname: nickname.trim() || null,
      gender,
      birthDate: birthDate.trim() || null,
      deathDate: deathDate.trim() || null,
      birthPlace: birthPlace.trim() || null,
      bio: bio.trim() || null,
    }

    try {
      if (isEdit) {
        await updatePerson(person.id, fields)
      } else if (linkContext) {
        const focused = getPerson(linkContext.focusedPersonId)
        const newId = await createPerson(fields)

        if (linkContext.relationType === 'parents') {
          await setParents(linkContext.focusedPersonId, [
            ...(focused?.parentIds ?? []),
            newId,
          ])
        } else if (linkContext.relationType === 'children') {
          const spouseIds = focused?.spouseIds ?? []
          const parentIds =
            spouseIds.length === 1
              ? [linkContext.focusedPersonId, spouseIds[0]]
              : [linkContext.focusedPersonId]
          await setParents(newId, parentIds)
        } else if (linkContext.relationType === 'spouses') {
          await linkSpouses(linkContext.focusedPersonId, newId)
        } else if (linkContext.relationType === 'siblings') {
          await setParents(newId, focused?.parentIds ?? [])
        }
      } else {
        await createPerson({ ...fields, isRoot: true })
      }
      onSaved?.()
    } catch (err) {
      setError('Não deu pra salvar. Tenta de novo.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>
            Nome completo *
          </label>
          <input
            autoFocus
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Apelido
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Gênero
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputClass}
          >
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Nascimento
            </label>
            <input
              placeholder="1954-03-12"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Falecimento
            </label>
            <input
              placeholder="opcional"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Local de nascimento
          </label>
          <input
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Notas / biografia
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-amber-300 py-3 text-base font-medium text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.4)] disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </Modal>
  )
}
