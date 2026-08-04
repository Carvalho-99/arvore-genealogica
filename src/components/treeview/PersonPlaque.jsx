import { lifespan } from '../../utils/dateFormat'

export default function PersonPlaque({ node, delay, onSelect }) {
  const { person, isRoot } = node
  const span = lifespan(person.birthDate, person.deathDate)
  const name = person.nickname || person.fullName

  return (
    <button
      onClick={() => onSelect(node)}
      className={`plaque ${isRoot ? 'plaque-root' : ''}`}
      style={{
        left: node.x,
        top: node.y,
        animationDelay: `${delay}ms`,
      }}
    >
      <span className="plaque-nail" aria-hidden="true" />
      {person.photoUrl && (
        <span className="plaque-photo">
          <img src={person.photoUrl} alt="" draggable={false} />
        </span>
      )}
      <span className="plaque-name">{name}</span>
      {span && <span className="plaque-dates">{span}</span>}
    </button>
  )
}
