import { useEffect, useMemo, useRef } from 'react'

// A câmera nunca reduz a cena abaixo do tamanho da viewport — o "mundo" é
// sempre do tamanho da tela (worldSize = viewport), e o zoom só amplia a
// partir daí (scale >= 1). Isso garante matematicamente que o fundo nunca
// deixa de cobrir 100% da tela, então nunca aparece nada "atrás" dele e
// nunca precisa de barra de rolagem.
const MIN_SCALE = 1
const MAX_SCALE = 3.2

export function usePanZoom({ containerRef, worldRef, worldSize }) {
  const transform = useRef({ x: 0, y: 0, scale: 1 })
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

  // com o mundo do tamanho da viewport, o range de arrasto permitido em cada
  // eixo é só o quanto o zoom "sobrou" além da tela: (tamanho*scale - tamanho)/2
  function clamp() {
    const { scale } = transform.current
    transform.current.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))

    const vw = worldSize.width
    const vh = worldSize.height
    const slackX = (vw * transform.current.scale - vw) / 2
    const slackY = (vh * transform.current.scale - vh) / 2

    transform.current.x = Math.min(slackX, Math.max(-slackX, transform.current.x))
    transform.current.y = Math.min(slackY, Math.max(-slackY, transform.current.y))
  }

  function stopAnim() {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }

  function centerOnPoint(px, py, targetScale) {
    const vw = worldSize.width
    const vh = worldSize.height
    if (!vw || !vh) return
    stopAnim()
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale ?? Math.max(transform.current.scale, 1.4)))

    const from = { ...transform.current }
    // desloca o suficiente pra levar o ponto (px,py) do mundo pro centro da viewport
    const to = {
      scale,
      x: vw / 2 - px * scale,
      y: vh / 2 - py * scale,
    }

    const slackX = (vw * scale - vw) / 2
    const slackY = (vh * scale - vh) / 2
    to.x = Math.min(slackX, Math.max(-slackX, to.x))
    to.y = Math.min(slackY, Math.max(-slackY, to.y))

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

  function resetView() {
    stopAnim()
    transform.current = { x: 0, y: 0, scale: 1 }
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
        clampSoft()
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
        clamp()
        apply()
      }
    }

    // durante o próprio gesto, deixa passar um pouco do limite (sensação
    // elástica) — o clamp "duro" só entra ao soltar, em clamp()
    function clampSoft() {
      const vw = worldSize.width
      const vh = worldSize.height
      const slackX = (vw * transform.current.scale - vw) / 2 + 60
      const slackY = (vh * transform.current.scale - vh) / 2 + 60
      transform.current.x = Math.min(slackX, Math.max(-slackX, transform.current.x))
      transform.current.y = Math.min(slackY, Math.max(-slackY, transform.current.y))
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
      clamp()
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
  }, [containerRef, apply, worldSize.width, worldSize.height])

  return { centerOnPoint, resetView, transformRef: transform }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
