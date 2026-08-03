import { lifespan } from '../../utils/dateFormat'

const genderIcon = { F: '👩', M: '👨', other: '🧑' }

export default function PersonCard({ person, onEdit, onDelete }) {
  const span = lifespan(person.birthDate, person.deathDate)

  return (
    <div className="rounded-2xl border border-amber-800/15 bg-amber-50/85 p-6 text-center shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-700/25 bg-white/70 text-4xl">
        {genderIcon[person.gender] ?? '🧑'}
      </div>
      <h1 className="mt-3 text-xl font-semibold text-stone-800">
        {person.fullName}
      </h1>
      {person.nickname && (
        <p className="text-sm text-stone-500">"{person.nickname}"</p>
      )}
      {span && <p className="mt-1 text-sm text-stone-600">{span}</p>}
      {person.birthPlace && (
        <p className="text-sm text-stone-500">{person.birthPlace}</p>
      )}
      {person.bio && (
        <p className="mt-3 whitespace-pre-wrap text-left text-sm text-stone-700">
          {person.bio}
        </p>
      )}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={onEdit}
          className="rounded-full border border-green-700/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-green-800 active:bg-green-50"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded-full border border-red-300 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 active:bg-red-100"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
