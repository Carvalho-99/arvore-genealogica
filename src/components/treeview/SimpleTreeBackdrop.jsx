import { forwardRef } from 'react'

const base = import.meta.env.BASE_URL

// Fundo calmo (sem efeitos cinematográficos) usado no Cenário e na
// Genealogia — a árvore muda com o horário e tem o parallax sutil do
// mouse, mas sem raios/borboletas/vagalumes/partículas. Esses efeitos
// ficam reservados só pro modo Explorar Interior (SceneLayers).
//
// Duas camadas: um fundo bem borrado cobrindo a tela inteira sem
// compromisso (só atmosfera, pode cortar à vontade) e a árvore em si por
// cima usando object-fit: contain, que nunca corta a copa nem as raízes,
// mesmo em telas bem largas.
const SimpleTreeBackdrop = forwardRef(function SimpleTreeBackdrop({ period }, ref) {
  return (
    <div ref={ref} className="empty-parallax-wrap">
      <img src={`${base}images/scenes/arvore_${period}.webp`} alt="" className="empty-parallax-backdrop" draggable={false} />
      <img src={`${base}images/scenes/arvore_${period}.webp`} alt="" className="empty-parallax-img" draggable={false} />
    </div>
  )
})

export default SimpleTreeBackdrop
