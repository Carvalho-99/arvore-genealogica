import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../../context/PeopleContext'
import { computeTreeLayout, fitLayoutToViewport } from '../../lib/treeLayout'
import { usePanZoom } from '../../hooks/usePanZoom'
import { useTimeOfDay } from '../../lib/timeOfDay'
import { preloadImages } from '../../lib/preload'
import PersonPlaque from './PersonPlaque'
import BranchConnectors from './BranchConnectors'
import AmbientLeaves from './AmbientLeaves'
import DustParticles from './DustParticles'
import SceneLayers, { periodImageUrls, sharedImageUrls } from './SceneLayers'
import PersonDetailModal from './PersonDetailModal'
import PersonFormModal from './PersonFormModal'
import SearchOverlay from './SearchOverlay'
import LoadingSpinner from '../common/LoadingSpinner'

const ALL_PERIODS = ['amanhecer', 'dia', 'por_do_sol', 'noite']

// zoom aplicado por modo, sobre a câmera do usuário — nunca muda o
// enquadramento, só aproxima/afasta em torno do centro da tela
const MODE_ZOOM = { cenario: 1, genealogia: 1.05, explorar: 1.175 }

export default function TreeCanvasPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()
  const period = useTimeOfDay()
  const containerRef = useRef(null)
  const worldRef = useRef(null)
  const sceneRef = useRef(null)
  const dustRef = useRef(null)

  const [mode, setMode] = useState('cenario') // 'cenario' | 'genealogia' | 'explorar'
  const [selected, setSelected] = useState(null)
  const [adding, setAdding] = useState(false)
  const [searching, setSearching] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  // a cena (fundo + câmera) é sempre do tamanho exato da viewport — nunca do
  // tamanho do conteúdo da árvore. É isso que garante 100% de tela sempre,
  // sem barra de rolagem e sem o zoom "revelar" o fundo da página.
  // Lê o tamanho na hora (não espera o primeiro callback assíncrono do
  // ResizeObserver, que às vezes demora/nunca dispara logo após um reload
  // e deixava a cena inteira em branco).
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

  const layout = useMemo(() => {
    if (!rootPerson) return { nodes: [], edges: [], width: 1600, height: 900 }
    return computeTreeLayout(people, rootPerson.id)
  }, [people, rootPerson])

  const fit = useMemo(
    () => fitLayoutToViewport(layout, viewport.width, viewport.height),
    [layout, viewport.width, viewport.height]
  )

  const { centerOnPoint, resetView } = usePanZoom({ containerRef, worldRef, worldSize: viewport })

  useEffect(() => {
    resetView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootPerson?.id])

  // parallax passivo: cada camada da cena se move um pouco ao mover o
  // mouse, em velocidades diferentes, pra dar sensação de profundidade —
  // igual à tela de abertura. As placas/galhos genealógicos ficam de fora
  // disso de propósito, pra continuar sempre clicáveis com precisão.
  function handleMouseMove(e) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    sceneRef.current?.applyParallax(px, py)
    if (dustRef.current) dustRef.current.style.transform = `translate(${px * -22}px, ${py * -15}px)`
  }

  function handleMouseLeave() {
    sceneRef.current?.resetParallax()
    if (dustRef.current) dustRef.current.style.transform = 'translate(0, 0)'
  }

  function screenPointOf(node) {
    return { x: node.x * fit.scale + fit.offsetX, y: node.y * fit.scale + fit.offsetY }
  }

  function handleSelect(node) {
    const p = screenPointOf(node)
    centerOnPoint(p.x, p.y - 30, Math.max(1.5, Math.min(2.4, fit.scale * 2.6)))
    setSelected(node.person)
    setMode('genealogia')
  }

  function goToPerson(id) {
    const node = layout.nodes.find((n) => n.id === id)
    if (node) handleSelect(node)
  }

  function toggleGenealogia() {
    setMode((m) => (m === 'genealogia' ? 'cenario' : 'genealogia'))
  }

  function toggleExplorar() {
    setMode((m) => (m === 'explorar' ? 'cenario' : 'explorar'))
  }

  if (loading) return <LoadingSpinner />

  const showDust = period === 'dia' || period === 'amanhecer'
  const inGenealogia = mode === 'genealogia'
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
            <div
              className="mode-zoom-layer"
              style={{ transform: `scale(${MODE_ZOOM[mode]})` }}
            >
              <div className={`scene-focus ${inGenealogia ? 'scene-focus-dimmed' : ''}`}>
                <SceneLayers ref={sceneRef} period={period} />

                {showDust && (
                  <div ref={dustRef} className="parallax-layer">
                    <DustParticles count={14} />
                  </div>
                )}

                <div className="tree-vignette-inner" />
              </div>

              {people.length > 0 && (
                <div className={`genealogy-layer ${inGenealogia ? 'genealogy-layer-visible' : ''}`}>
                  <div
                    className="absolute left-0 top-0"
                    style={{
                      width: layout.width,
                      height: layout.height,
                      transform: `translate(${fit.offsetX}px, ${fit.offsetY}px) scale(${fit.scale})`,
                      transformOrigin: '0 0',
                    }}
                  >
                    <BranchConnectors nodes={layout.nodes} spouseEdges={layout.edges.filter((e) => e.type === 'spouse')} />
                    {layout.nodes.map((node, i) => (
                      <PersonPlaque
                        key={node.id}
                        node={node}
                        delay={Math.min(i * 45, 900)}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="tree-vignette pointer-events-none" />
      <AmbientLeaves count={7} />

      {people.length === 0 && (
        <div className="empty-card-wrap pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6">
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-amber-200/15 bg-black/40 p-8 text-center backdrop-blur-md">
            <p className="font-serif-display text-lg text-amber-50">
              A árvore ainda está vazia
            </p>
            <p className="mt-2 text-sm text-amber-100/70">
              Plante a primeira pessoa da família e comece a fazer a árvore crescer.
            </p>
            <button onClick={() => setAdding(true)} className="mt-5 btn-gold">
              Adicionar primeira pessoa
            </button>
          </div>
        </div>
      )}

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
            {rootPerson && (
              <button onClick={() => goToPerson(rootPerson.id)} className="glass-btn" aria-label="Centralizar na raiz">
                ⌂
              </button>
            )}
            {people.length > 0 && (
              <button onClick={() => setSearching(true)} className="glass-btn" aria-label="Buscar pessoa">
                ⌕
              </button>
            )}
            <button onClick={() => navigate('/pesquisa')} className="glass-btn" aria-label="Central de pesquisa">
              ❦
            </button>
          </div>
        </div>
      )}

      {people.length > 0 && !inExplorar && (
        <>
          <div
            className="pointer-events-none fixed inset-x-0 z-20 flex justify-center gap-2.5 px-4"
            style={{ bottom: 'calc(env(safe-area-inset-bottom) + 26px)' }}
          >
            <button
              onClick={toggleGenealogia}
              className={`pointer-events-auto mode-pill ${inGenealogia ? 'mode-pill-active' : ''}`}
            >
              🌳 {inGenealogia ? 'Fechar genealogia' : 'Ver genealogia'}
            </button>
            <button onClick={toggleExplorar} className="pointer-events-auto mode-pill">
              🔍 Explorar Interior
            </button>
          </div>

          <button
            onClick={() => setAdding(true)}
            className="fab-add"
            aria-label="Adicionar pessoa"
          >
            +
          </button>
        </>
      )}

      {inExplorar && (
        <button
          onClick={() => setMode('cenario')}
          className="explore-back-btn"
        >
          ⟵ Voltar
        </button>
      )}

      {selected && (
        <PersonDetailModal
          person={selected}
          onClose={() => setSelected(null)}
          onNavigate={goToPerson}
        />
      )}

      {adding && (
        <PersonFormModal
          onClose={() => setAdding(false)}
          onSaved={() => {
            // adicionar alguém nunca move a câmera nem abre a genealogia
            // sozinho — o cartão só aparece quando o usuário abrir "Ver
            // genealogia" por conta própria.
            setAdding(false)
          }}
        />
      )}

      {searching && (
        <SearchOverlay
          onSelect={(id) => {
            setSearching(false)
            goToPerson(id)
          }}
          onClose={() => setSearching(false)}
        />
      )}
    </div>
  )
}
