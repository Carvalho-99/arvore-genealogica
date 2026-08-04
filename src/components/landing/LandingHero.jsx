import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AmbientLeaves from '../treeview/AmbientLeaves'

const base = import.meta.env.BASE_URL

export default function LandingHero() {
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const [leaving, setLeaving] = useState(false)

  function handleMouseMove(e) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--parallax-x', `${px * -24}px`)
    el.style.setProperty('--parallax-y', `${py * -16}px`)
  }

  function handleEnter() {
    setLeaving(true)
    setTimeout(() => navigate('/arvore'), 720)
  }

  return (
    <div
      className={`hero-stage ${leaving ? 'hero-leaving' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <div ref={wrapRef} className="hero-bg-wrap">
        <img src={`${base}hero.jpg`} alt="" className="hero-bg-img" draggable={false} />
      </div>

      <div className="hero-mist hero-mist-a" />
      <div className="hero-mist hero-mist-b" />
      <div className="hero-vignette" />

      <AmbientLeaves count={9} />

      <div className="hero-content">
        <p className="hero-kicker">Família</p>
        <h1 className="hero-title">Árvore Genealógica</h1>
        <p className="hero-subtitle">Mostafá</p>
        <button onClick={handleEnter} className="hero-enter-btn">
          Entrar
        </button>
      </div>
    </div>
  )
}
