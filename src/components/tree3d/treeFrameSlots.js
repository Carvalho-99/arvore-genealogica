// Posições aproximadas (% da largura/altura) das áreas de copa da
// ilustração `front.jpg`, usadas pra pendurar o nome de cada pessoa
// "na árvore" sem precisar acertar o pixel exato de cada moldurinha
// desenhada (a arte é só decorativa). A ordem começa com pontos bem
// espalhados por toda a copa (não só o topo), pra árvores pequenas
// não ficarem com os nomes amontoados num canto só.
export const CANOPY_SLOTS = [
  { x: 50, y: 24 },
  { x: 12, y: 44 },
  { x: 91, y: 38 },
  { x: 32, y: 54 },
  { x: 66, y: 56 },
  { x: 6, y: 55 },
  { x: 94, y: 58 },
  { x: 33, y: 63 },
  { x: 69, y: 63 },
  { x: 21, y: 74 },
  { x: 70, y: 74 },
  { x: 44, y: 14 }, { x: 52, y: 14 },
  { x: 35, y: 18 }, { x: 61, y: 18 },
  { x: 23, y: 20 }, { x: 67, y: 17 },
  { x: 58, y: 26 }, { x: 17, y: 29 }, { x: 78, y: 23 },
  { x: 38, y: 27 }, { x: 72, y: 24 },
  { x: 44, y: 35 }, { x: 57, y: 38 },
  { x: 30, y: 36 }, { x: 73, y: 36 },
  { x: 26, y: 34 }, { x: 86, y: 35 },
  { x: 42, y: 44 }, { x: 63, y: 47 },
  { x: 28, y: 47 }, { x: 72, y: 44 },
  { x: 16, y: 57 }, { x: 77, y: 53 },
  { x: 87, y: 55 },
  { x: 18, y: 66 }, { x: 86, y: 64 }, { x: 10, y: 64 }, { x: 95, y: 62 },
  { x: 12, y: 73 }, { x: 36, y: 73 },
]

// moldura grande no tronco, reservada pro nome da pessoa "raiz"
export const TRUNK_SLOT = { x: 50, y: 81 }
