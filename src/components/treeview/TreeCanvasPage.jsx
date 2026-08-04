import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../../context/PeopleContext'
import { computeTreeLayout } from '../../lib/treeLayout'
import { usePanZoom } from '../../hooks/usePanZoom'
import PersonPlaque from './PersonPlaque'
import TreeConnectors from './TreeConnectors'
import AmbientLeaves from './AmbientLeaves'
import PersonDetailModal from './PersonDetailModal'
import PersonFormModal from './PersonFormModal'
import SearchOverlay from './SearchOverlay'
import LoadingSpinner from '../common/LoadingSpinner'

const base = import.meta.env.BASE_URL

export default function TreeCanvasPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const worldRef = useRef(null)

  const [selected, setSelected] = useState(null)
  const [adding, setAdding] = useState(false)
  const [searching, setSearching] = useState(false)

  const layout = useMemo(() => {
    if (!rootPerson) return { nodes: [], edges: [], width: 1600, height: 900 }
    return computeTreeLayout(people, rootPerson.id)
  }, [people, rootPerson])

  const worldSize = { width: layout.width || 1600, height: layout.height || 900 }
  const { centerOnPoint, fitToViewport } = usePanZoom({ containerRef, worldRef, worldSize })

  useEffect(() => {
    if (!rootPerson || layout.nodes.length === 0) return
    const raf = requestAnimationFrame(fitToViewport)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootPerson?.id, layout.width, layout.height])

  function handleSelect(node) {
    centerOnPoint(node.x, node.y - 40, 1)
    setSelected(node.person)
  }

  function goToPerson(id) {
    const node = layout.nodes.find((n) => n.id === id)
    if (node) handleSelect(node)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0c0a06]">
      {people.length === 0 ? (
        <EmptyForest onStart={() => setAdding(true)} />
      ) : (
        <div
          ref={containerRef}
          className="absolute inset-0 touch-none select-none"
          style={{ cursor: 'grab' }}
        >
          <div
            ref={worldRef}
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: worldSize.width, height: worldSize.height, willChange: 'transform' }}
          >
            <img
              src={`${base}tree-bg.jpg`}
              alt=""
              draggable={false}
              className="absolute left-0 top-0 h-full w-full object-cover"
              style={{ filter: 'brightness(0.82) saturate(1.05)' }}
            />
            <div className="tree-vignette-inner" />

            <TreeConnectors edges={layout.edges} width={worldSize.width} height={worldSize.height} />

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

      <div className="tree-vignette pointer-events-none" />
      <AmbientLeaves count={7} />

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

      {people.length > 0 && (
        <button
          onClick={() => setAdding(true)}
          className="fab-add"
          aria-label="Adicionar pessoa"
        >
          +
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
          onSaved={(id) => {
            setAdding(false)
            setTimeout(() => goToPerson(id), 250)
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

function EmptyForest({ onStart }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <img
        src={`${base}tree-bg.jpg`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="tree-vignette pointer-events-none" />
      <div className="relative z-10 mx-6 max-w-sm rounded-2xl border border-amber-200/15 bg-black/40 p-8 text-center backdrop-blur-md">
        <p className="font-serif-display text-lg text-amber-50">
          A árvore ainda está vazia
        </p>
        <p className="mt-2 text-sm text-amber-100/70">
          Plante a primeira pessoa da família e comece a fazer a árvore crescer.
        </p>
        <button onClick={onStart} className="mt-5 btn-gold">
          Adicionar primeira pessoa
        </button>
      </div>
    </div>
  )
}
