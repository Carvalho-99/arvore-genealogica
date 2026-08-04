const cache = new Set()

// Esquenta o cache do navegador pra imagem já estar pronta quando for
// realmente usada (evita "pop-in" na hora de trocar de cenário).
export function preloadImage(src) {
  if (cache.has(src)) return
  cache.add(src)
  const img = new Image()
  img.src = src
}

export function preloadImages(srcs) {
  srcs.forEach(preloadImage)
}
