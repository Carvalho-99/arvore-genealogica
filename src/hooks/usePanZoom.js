import { useEffect, useMemo, useRef } from 'react'

const MIN_SCALE = 0.35
const MAX_SCALE = 2.2

// Pan + zoom (arrastar, roda do mouse, pinça no touch) escrito na unha, sem
// libs — mantém tudo num ref e escreve direto no transform do DOM a cada
// frame, sem passar pelo ciclo de render do React (senão o arrasto fica
// engasgado no celular).
export function usePanZoom({ containerRef, worldRef, worldSize }) {
  const transform = useRef({ x: 0, y: 0, scale: 0.62 })
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const animRef = useRef(null)

  const apply = useMemo(
    () => () => {
      const el = worldRef.current
      if (!el) return
      const { x, y, scale } = transform.current
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    },
    [worldRef]
  )

  function clamp() {
    const container = containerRef.current
    if (!container) return
    const { scale } = transform.current
    transform.current.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))

    const vw = container.clientWidth
    const vh = container.clientHeight
    const worldW = worldSize.width * transform.current.scale
    const worldH = worldSize.height * transform.current.scale

    // deixa sempre pelo menos uma faixa da árvore visível, mesmo arrastando pro limite
    const slack = 220
    const minX = Math.min(vw - worldW - slack, vw / 2 - worldW / 2)
    const maxX = Math.max(slack, vw / 2 - worldW / 2)
    const minY = Math.min(vh - worldH - slack, vh / 2 - worldH / 2)
    const maxY = Math.max(slack, vh / 2 - worldH / 2)

    transform.current.x = Math.min(maxX, Math.max(minX, transform.current.x))
    transform.current.y = Math.min(maxY, Math.max(minY, transform.current.y))
  }

  function stopAnim() {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }

  function centerOnPoint(px, py, targetScale) {
    const container = containerRef.current
    if (!container) return
    stopAnim()
    const vw = container.clientWidth
    const vh = container.clientHeight
    const scale = targetScale ?? Math.max(transform.current.scale, 0.85)

    const from = { ...transform.current }
    const to = {
      scale,
      x: vw / 2 - px * scale,
      y: vh / 2 - py * scale,
    }

    const duration = 620
    const start = performance.now()
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      transform.current = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
        scale: from.scale + (to.scale - from.scale) * eased,
      }
      apply()
      if (t < 1) animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
  }

  function fitToViewport() {
    const container = containerRef.current
    if (!container) return
    const vw = container.clientWidth
    const vh = container.clientHeight
    const scale = Math.min(1, Math.min(vw / worldSize.width, (vh * 1.6) / worldSize.height))
    transform.current = {
      scale: Math.max(MIN_SCALE, scale),
      x: vw / 2 - (worldSize.width / 2) * scale,
      y: vh * 0.16,
    }
    apply()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onPointerDown(e) {
      // pressionar um botão (placa, etc.) não deve virar gesto de arrastar —
      // setPointerCapture no container rouba o clique do botão se a gente
      // capturar aqui também, então deixa o clique nativo acontecer sozinho.
      if (e.target.closest('button, a')) return

      container.setPointerCapture(e.pointerId)
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      stopAnim()
      if (pointers.current.size === 1) {
        gesture.current = { type: 'pan', startX: e.clientX, startY: e.clientY, origin: { ...transform.current } }
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        gesture.current = {
          type: 'pinch',
          startDist: distance(a, b),
          midpoint: midpoint(a, b),
          origin: { ...transform.current },
        }
      }
    }

    function onPointerMove(e) {
      if (!pointers.current.has(e.pointerId)) return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const g = gesture.current
      if (!g) return

      if (g.type === 'pan' && pointers.current.size === 1) {
        transform.current.x = g.origin.x + (e.clientX - g.startX)
        transform.current.y = g.origin.y + (e.clientY - g.startY)
        apply()
      } else if (g.type === 'pinch' && pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        const dist = distance(a, b)
        const ratio = dist / g.startDist
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, g.origin.scale * ratio))
        const rect = container.getBoundingClientRect()
        const anchorX = g.midpoint.x - rect.left
        const anchorY = g.midpoint.y - rect.top
        const worldX = (anchorX - g.origin.x) / g.origin.scale
        const worldY = (anchorY - g.origin.y) / g.origin.scale
        transform.current.scale = newScale
        transform.current.x = anchorX - worldX * newScale
        transform.current.y = anchorY - worldY * newScale
        apply()
      }
    }

    function endPointer(e) {
      pointers.current.delete(e.pointerId)
      if (pointers.current.size === 0) {
        gesture.current = null
        clamp()
        apply()
      } else if (pointers.current.size === 1) {
        const [p] = [...pointers.current.values()]
        gesture.current = { type: 'pan', startX: p.x, startY: p.y, origin: { ...transform.current } }
      }
    }

    function onWheel(e) {
      e.preventDefault()
      stopAnim()
      const rect = container.getBoundingClientRect()
      const anchorX = e.clientX - rect.left
      const anchorY = e.clientY - rect.top
      const delta = -e.deltaY * 0.0015
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.current.scale * (1 + delta)))
      const worldX = (anchorX - transform.current.x) / transform.current.scale
      const worldY = (anchorY - transform.current.y) / transform.current.scale
      transform.current.scale = newScale
      transform.current.x = anchorX - worldX * newScale
      transform.current.y = anchorY - worldY * newScale
      apply()
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', endPointer)
    container.addEventListener('pointercancel', endPointer)
    container.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', endPointer)
      container.removeEventListener('pointercancel', endPointer)
      container.removeEventListener('wheel', onWheel)
      stopAnim()
    }
  }, [containerRef, apply])

  return { centerOnPoint, fitToViewport, transformRef: transform }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
