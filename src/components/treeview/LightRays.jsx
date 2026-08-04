// Camada de luz extra, bem sutil, por cima da luz já pintada no fundo —
// só pra dar uma respiração viva à cena (não é a fonte principal de luz).
export default function LightRays() {
  return (
    <div className="light-rays" aria-hidden="true">
      <div className="light-ray light-ray-a" />
      <div className="light-ray light-ray-b" />
    </div>
  )
}
