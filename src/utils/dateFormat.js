// Datas são livres ("1954" | "1954-03" | "1954-03-12"), então só formatamos
// o que existir em vez de exigir uma data completa.
export function lifespan(birthDate, deathDate) {
  if (!birthDate && !deathDate) return null
  const birth = birthDate ?? '?'
  if (!deathDate) return `n. ${birth}`
  return `${birth} – ${deathDate}`
}
