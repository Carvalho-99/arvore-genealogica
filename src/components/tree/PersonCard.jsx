import { lifespan } from '../../utils/dateFormat'

const genderIcon = { F: '👩', M: '👨', other: '🧑' }

export default function PersonCard({ person, onEdit, onDelete }) {
  const span = lifespan(person.birthDate, person.deathDate)

  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-stone-800">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-4xl dark:bg-stone-700">
        {genderIcon[person.gender] ?? '🧑'}
      </div>
      <h1 className="mt-3 text-xl font-semibold text-stone-900 dark:text-stone-100">
        {person.fullName}
      </h1>
      {person.nickname && (
        <p className="text-sm text-stone-400">"{person.nickname}"</p>
      )}
      {span && (
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {span}
        </p>
      )}
      {person.birthPlace && (
        <p className="text-sm text-stone-400">{person.birthPlace}</p>
      )}
      {person.bio && (
        <p className="mt-3 whitespace-pre-wrap text-left text-sm text-stone-600 dark:text-stone-300">
          {person.bio}
        </p>
      )}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={onEdit}
          className="rounded-full bg-stone-100 px-4 py-1.5 text-sm font-medium text-stone-700 active:bg-stone-200 dark:bg-stone-700 dark:text-stone-200"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 active:bg-red-100 dark:bg-red-950 dark:text-red-300"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
