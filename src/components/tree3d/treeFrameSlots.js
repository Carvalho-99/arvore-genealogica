// Posições (% da largura/altura) das molduras douradas da ilustração
// `tree.jpg`, encontradas automaticamente detectando a cor dourada das
// bordas das molduras na imagem (não é chute visual) e completadas por
// simetria (espelhando left↔right) onde a detecção só pegou um lado.
export const CANOPY_SLOTS = [
  { x: 30.1, y: 20.3 }, { x: 69.9, y: 20.9 },
  { x: 38.0, y: 20.9 }, { x: 61.9, y: 20.9 },
  { x: 43.3, y: 32.3 }, { x: 56.9, y: 32.3 },
  { x: 33.9, y: 32.3 }, { x: 66.1, y: 32.3 },
  { x: 29.6, y: 43.6 }, { x: 70.4, y: 43.6 },
  { x: 19.8, y: 43.7 }, { x: 80.2, y: 43.7 },
  { x: 19.4, y: 54.9 }, { x: 80.5, y: 54.9 },
  { x: 18.9, y: 67.2 }, { x: 81.1, y: 67.2 },
  { x: 31.8, y: 68.3 }, { x: 68.4, y: 68.0 },
  { x: 14.9, y: 73.2 }, { x: 85.1, y: 73.2 },
  { x: 26.9, y: 78.5 }, { x: 72.8, y: 78.7 },
  { x: 14.9, y: 79.0 }, { x: 84.7, y: 77.5 },
]

// moldura grande na base do tronco, reservada pro nome da pessoa "raiz"
export const TRUNK_SLOT = { x: 50, y: 87.5 }
