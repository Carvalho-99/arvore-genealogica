import { useState } from 'react'
import { usePeople } from '../../context/PeopleContext'
import {
  createPerson,
  linkSpouses,
  setParents,
  unlinkSpouses,
  updatePerson,
} from '../../services/firestore/peopleService'
import PeopleMultiSelect from './PeopleMultiSelect'

const inputClass = 'form-input'
const labelClass = 'form-label'

export default function PersonFormModal({ person = null, onClose, onSaved }) {
  const { people, getChildren } = usePeople()
  const isEdit = Boolean(person)

  const [fullName, setFullName] = useState(person?.fullName ?? '')
  const [nickname, setNickname] = useState(person?.nickname ?? '')
  const [gender, setGender] = useState(person?.gender ?? 'other')
  const [birthDate, setBirthDate] = useState(person?.birthDate ?? '')
  const [deathDate, setDeathDate] = useState(person?.deathDate ?? '')
  const [birthPlace, setBirthPlace] = useState(person?.birthPlace ?? '')
  const [photoUrl, setPhotoUrl] = useState(person?.photoUrl ?? '')
  const [bio, setBio] = useState(person?.bio ?? '')

  const [parentIds, setParentIds] = useState(person?.parentIds ?? [])
  const [spouseIds, setSpouseIds] = useState(person?.spouseIds ?? [])
  const [childIds, setChildIds] = useState(() => (isEdit ? getChildren(person.id).map((c) => c.id) : []))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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
      photoUrl: photoUrl.trim() || null,
      bio: bio.trim() || null,
    }

    try {
      let id
      if (isEdit) {
        id = person.id
        await updatePerson(id, fields)
        await syncSpouses(id, person.spouseIds ?? [], spouseIds)
        await syncChildren(id, getChildren(id), childIds)
        if (!sameIds(parentIds, person.parentIds ?? [])) {
          await setParents(id, parentIds)
        }
      } else {
        id = await createPerson({ ...fields, isRoot: people.length === 0 })
        if (parentIds.length) await setParents(id, parentIds)
        for (const spouseId of spouseIds) await linkSpouses(id, spouseId)
        await syncChildren(id, [], childIds)
      }
      onSaved?.(id)
    } catch (err) {
      setError('Não deu pra salvar. Tenta de novo.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function syncSpouses(id, oldIds, newIds) {
    const toAdd = newIds.filter((x) => !oldIds.includes(x))
    const toRemove = oldIds.filter((x) => !newIds.includes(x))
    for (const spouseId of toAdd) await linkSpouses(id, spouseId)
    for (const spouseId of toRemove) await unlinkSpouses(id, spouseId)
  }

  async function syncChildren(id, oldChildren, newIds) {
    const oldIds = oldChildren.map((c) => c.id)
    const toAdd = newIds.filter((x) => !oldIds.includes(x))
    const toRemove = oldIds.filter((x) => !newIds.includes(x))
    for (const childId of toAdd) {
      const child = people.find((p) => p.id === childId)
      const ids = new Set(child?.parentIds ?? [])
      ids.add(id)
      await setParents(childId, [...ids])
    }
    for (const childId of toRemove) {
      const child = oldChildren.find((c) => c.id === childId)
      await setParents(childId, (child?.parentIds ?? []).filter((pid) => pid !== id))
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="form-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-xl text-amber-50">
            {isEdit ? 'Editar pessoa' : 'Adicionar pessoa'}
          </h2>
          <button onClick={onClose} className="detail-close static" aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={labelClass}>Nome completo *</label>
            <input autoFocus required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Apelido</label>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Gênero</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nascimento</label>
              <input placeholder="1954-03-12" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Falecimento</label>
              <input placeholder="opcional" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Local de nascimento</label>
            <input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Foto (link de imagem, opcional)</label>
            <input placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputClass} />
          </div>

          <PeopleMultiSelect
            label="Pai / Mãe"
            selectedIds={parentIds}
            onChange={setParentIds}
            excludeIds={isEdit ? [person.id] : []}
            allPeople={people}
          />
          <PeopleMultiSelect
            label="Cônjuge"
            selectedIds={spouseIds}
            onChange={setSpouseIds}
            excludeIds={isEdit ? [person.id] : []}
            allPeople={people}
          />
          <PeopleMultiSelect
            label="Filhos"
            selectedIds={childIds}
            onChange={setChildIds}
            excludeIds={isEdit ? [person.id] : []}
            allPeople={people}
          />

          <div>
            <label className={labelClass}>Observações</label>
            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button type="submit" disabled={saving} className="btn-gold w-full">
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  )
}

function sameIds(a, b) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((id) => set.has(id))
}
