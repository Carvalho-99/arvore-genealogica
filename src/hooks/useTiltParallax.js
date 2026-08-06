import { useEffect, useRef } from 'react'

// Só ativa quando o toque é a entrada principal (celular/tablet) — um
// desktop com tela touch secundária nunca aciona isso, e o mouse
// continua sendo o único controle do parallax lá.
function isTouchPrimary() {
  return typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
}

const TILT_RANGE_DEG = 18 // inclinação "leve" que já produz o efeito máximo (px/py = ±0.5)
const LERP_FACTOR = 0.08 // suavização por frame — evita qualquer "tranco"

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

// Traduz a inclinação do aparelho (giroscópio) pra exatamente a mesma
// escala px/py (-0.5..0.5) que o parallax de mouse já usa, e chama
// `onTilt(px, py)` a cada frame (via requestAnimationFrame, com
// interpolação/lerp). Assim alimenta o mesmo sistema de profundidade por
// camada já calibrado pro mouse, sem duplicar nenhuma lógica.
export function useTiltParallax(onTilt) {
  const onTiltRef = useRef(onTilt)
  onTiltRef.current = onTilt

  useEffect(() => {
    if (!isTouchPrimary()) return
    if (typeof DeviceOrientationEvent === 'undefined') return

    let rafId = null
    let attached = false
    let touchListenerAttached = false
    const base = { current: null }
    const target = { px: 0, py: 0 }
    const current = { px: 0, py: 0 }

    function tick() {
      current.px += (target.px - current.px) * LERP_FACTOR
      current.py += (target.py - current.py) * LERP_FACTOR
      onTiltRef.current(current.px, current.py)
      rafId = requestAnimationFrame(tick)
    }

    function handleOrientation(e) {
      if (e.beta == null || e.gamma == null) return
      if (!base.current) base.current = { beta: e.beta, gamma: e.gamma }
      const dGamma = e.gamma - base.current.gamma
      const dBeta = e.beta - base.current.beta
      target.px = clamp(dGamma / TILT_RANGE_DEG, -1, 1) * 0.5
      target.py = clamp(dBeta / TILT_RANGE_DEG, -1, 1) * 0.5
      // só liga o loop de animação quando o primeiro dado real chega —
      // em aparelhos sem giroscópio o evento nunca dispara, então nunca
      // gasta um rAF à toa
      if (rafId == null) rafId = requestAnimationFrame(tick)
    }

    function start() {
      if (attached) return
      attached = true
      window.addEventListener('deviceorientation', handleOrientation)
    }

    function requestOnFirstTouch() {
      DeviceOrientationEvent.requestPermission()
        .then((result) => {
          if (result === 'granted') start()
          // negado: não faz nada — fica só com as animações que já existem
        })
        .catch(() => {
          // não suportado/erro: nada quebra, cai de volta pro comportamento atual
        })
    }

    const needsPermission = typeof DeviceOrientationEvent.requestPermission === 'function'

    if (!needsPermission) {
      start()
    } else {
      // iOS 13+ só libera DeviceOrientationEvent a partir de um gesto do
      // usuário — escuta o primeiro toque na tela pra pedir a permissão
      touchListenerAttached = true
      window.addEventListener('touchstart', requestOnFirstTouch, { once: true, passive: true })
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      if (touchListenerAttached) window.removeEventListener('touchstart', requestOnFirstTouch)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [])
}
