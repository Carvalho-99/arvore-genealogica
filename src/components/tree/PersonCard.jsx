import { lifespan } from '../../utils/dateFormat'

const genderIcon = { F: '👩', M: '👨', other: '🧑' }

export default function PersonCard({ person, onEdit, onDelete }) {
  const span = lifespan(person.birthDate, person.deathDate)

  return (
    <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-6 text-center shadow-[0_0_30px_-8px_rgba(34,211,238,0.2)] backdrop-blur-md">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/30 bg-slate-800/80 text-4xl shadow-[0_0_20px_-4px_rgba(251,191,36,0.4)]">
        {genderIcon[person.gender] ?? '🧑'}
      </div>
      <h1 className="mt-3 text-xl font-semibold text-slate-100">
        {person.fullName}
      </h1>
      {person.nickname && (
        <p className="text-sm text-slate-500">"{person.nickname}"</p>
      )}
      {span && <p className="mt-1 text-sm text-slate-400">{span}</p>}
      {person.birthPlace && (
        <p className="text-sm text-slate-500">{person.birthPlace}</p>
      )}
      {person.bio && (
        <p className="mt-3 whitespace-pre-wrap text-left text-sm text-slate-300">
          {person.bio}
        </p>
      )}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={onEdit}
          className="rounded-full border border-cyan-400/20 bg-slate-800/80 px-4 py-1.5 text-sm font-medium text-cyan-200 active:bg-slate-700"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-300 active:bg-red-500/20"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
