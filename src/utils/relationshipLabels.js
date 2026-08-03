export function parentLabel(gender) {
  if (gender === 'F') return 'Mãe'
  if (gender === 'M') return 'Pai'
  return 'Responsável'
}

export function childLabel(gender) {
  if (gender === 'F') return 'Filha'
  if (gender === 'M') return 'Filho'
  return 'Filho(a)'
}

export function spouseLabel(gender) {
  if (gender === 'F') return 'Esposa'
  if (gender === 'M') return 'Esposo'
  return 'Cônjuge'
}

export function siblingLabel(gender) {
  if (gender === 'F') return 'Irmã'
  if (gender === 'M') return 'Irmão'
  return 'Irmão(ã)'
}
