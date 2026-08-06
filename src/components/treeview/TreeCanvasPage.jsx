import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePanZoom } from '../../hooks/usePanZoom'
import { useTimeOfDay } from '../../lib/timeOfDay'
import { preloadImages } from '../../lib/preload'
import AmbientLeaves from './AmbientLeaves'
import DustParticles from './DustParticles'
import SceneLayers, { periodImageUrls, sharedImageUrls } from './SceneLayers'
import SimpleTreeBackdrop from './SimpleTreeBackdrop'

const ALL_PERIODS = ['amanhecer', 'dia', 'por_do_sol', 'noite']

const PERIOD_ICONS = { amanhecer: '🌅', dia: '☀️', por_do_sol: '🌇', noite: '🌙' }
const PERIOD_LABELS = { amanhecer: 'Amanhecer', dia: 'Dia', por_do_sol: 'Pôr do sol', noite: 'Noite' }

// zoom aplicado por modo, sobre a câmera do usuário — nunca muda o
// enquadramento, só aproxima/afasta em torno do centro da tela
const MODE_ZOOM = { cenario: 1, explorar: 1.175 }

// A árvore principal é só cenário (calmo) e Explorar Interior (visual,
// cinematográfico) — não existe mais cadastro/genealogia aqui. Ver e
// gerenciar a família é tudo feito na Lista Simples (/lista).
export default function TreeCanvasPage() {
  const navigate = useNavigate()
  const { period, isOverridden, cycleOverride } = useTimeOfDay()
  const containerRef = useRef(null)
  const worldRef = useRef(null)
  const sceneRef = useRef(null)
  const dustRef = useRef(null)
  const simpleBgRef = useRef(null)

  const [mode, setMode] = useState('cenario') // 'cenario' | 'explorar'
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  // a cena (fundo + câmera) é sempre do tamanho exato da viewport — nunca do
  // tamanho do conteúdo. É isso que garante 100% de tela sempre, sem barra
  // de rolagem e sem o zoom "revelar" o fundo da página.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setViewport({ width: rect.width, height: rect.height })
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setViewport({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // esquenta o cache do navegador com as imagens do período atual na hora,
  // e as dos outros 3 períodos aos poucos, sem competir com o carregamento
  // inicial — assim a troca de cenário nunca trava.
  useEffect(() => {
    preloadImages([...sharedImageUrls(), ...periodImageUrls(period)])
    const idle = setTimeout(() => {
      ALL_PERIODS.filter((p) => p !== period).forEach((p) => preloadImages(periodImageUrls(p)))
    }, 2500)
    return () => clearTimeout(idle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  usePanZoom({ containerRef, worldRef, worldSize: viewport })

  // parallax passivo: a camada de fundo visível (o cenário calmo ou, no
  // Explorar Interior, a cena cinematográfica completa) se move um pouco
  // ao mover o mouse — igual à tela de abertura.
  function applyParallaxAt(px, py) {
    sceneRef.current?.applyParallax(px, py)
    if (dustRef.current) dustRef.current.style.transform = `translate3d(${px * -22}px, ${py * -15}px, 0)`
    if (simpleBgRef.current) {
      simpleBgRef.current.style.setProperty('--parallax-x', `${px * -24}px`)
      simpleBgRef.current.style.setProperty('--parallax-y', `${py * -16}px`)
    }
  }

  function handleMouseMove(e) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    applyParallaxAt(px, py)
  }

  function handleMouseLeave() {
    sceneRef.current?.resetParallax()
    if (dustRef.current) dustRef.current.style.transform = 'translate3d(0, 0, 0)'
    if (simpleBgRef.current) {
      simpleBgRef.current.style.setProperty('--parallax-x', '0px')
      simpleBgRef.current.style.setProperty('--parallax-y', '0px')
    }
  }

  const showDust = period === 'dia' || period === 'amanhecer'
  const inExplorar = mode === 'explorar'

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0c0a06]">
      <div
        ref={containerRef}
        className="absolute inset-0 touch-none select-none"
        style={{ cursor: 'grab' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {viewport.width > 0 && (
          <div
            ref={worldRef}
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: viewport.width, height: viewport.height, willChange: 'transform' }}
          >
            <div className="mode-zoom-layer" style={{ transform: `scale(${MODE_ZOOM[mode]})` }}>
              {inExplorar ? (
                <div className="scene-focus">
                  <SceneLayers ref={sceneRef} period={period} />

                  {showDust && (
                    <div ref={dustRef} className="parallax-layer">
                      <DustParticles count={14} />
                    </div>
                  )}

                  <div className="tree-vignette-inner" />
                </div>
              ) : (
                <div className="scene-focus">
                  <SimpleTreeBackdrop ref={simpleBgRef} period={period} />
                  <div className="tree-vignette-inner" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="tree-vignette pointer-events-none" />
      <AmbientLeaves count={7} />

      {!inExplorar && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 14px)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="pointer-events-auto glass-btn"
            aria-label="Início"
          >
            ⟵
          </button>
          <div className="pointer-events-auto flex gap-2">
            <button
              onClick={cycleOverride}
              className="glass-btn"
              aria-label={isOverridden ? `Cenário fixo: ${PERIOD_LABELS[period]} (toque pra mudar)` : 'Cenário automático (toque pra fixar um horário)'}
              title={isOverridden ? `Fixo em ${PERIOD_LABELS[period]} — toque pra avançar` : 'Automático — toque pra fixar um horário'}
            >
              {isOverridden ? PERIOD_ICONS[period] : '🕐'}
            </button>
            <button onClick={() => navigate('/pesquisa')} className="glass-btn" aria-label="Central de pesquisa">
              ❦
            </button>
            <button onClick={() => navigate('/lista')} className="glass-btn" aria-label="Lista de nomes">
              ☰
            </button>
          </div>
        </div>
      )}

      {!inExplorar && (
        <div
          className="pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 26px)' }}
        >
          <button onClick={() => setMode('explorar')} className="pointer-events-auto mode-pill">
            🔍 Explorar Interior
          </button>
        </div>
      )}

      {inExplorar && (
        <button onClick={() => setMode('cenario')} className="explore-back-btn">
          ⟵ Voltar
        </button>
      )}
    </div>
  )
}
