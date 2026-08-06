import { useEffect, useState } from 'react'

// Faixas de horário → cenário. Meia-noite cruza a faixa da noite (19:00–04:59),
// por isso ela é tratada à parte no fim.
const PERIODS = [
  { key: 'amanhecer', from: 5, to: 8 },
  { key: 'dia', from: 8, to: 17.5 },
  { key: 'por_do_sol', from: 17.5, to: 19 },
]

// os 4 "de sempre" — os únicos que a troca automática por horário usa, e
// os únicos com cena cinematográfica completa (Explorar Interior)
export const CINEMATIC_PERIODS = ['amanhecer', 'dia', 'por_do_sol', 'noite']

// extras só de clima — nunca entram sozinhos pela troca automática, só
// aparecem se o usuário escolher manualmente no botão
const EXTRA_PERIODS = ['chuva', 'neve', 'nublado']

const CYCLE_PERIODS = [...CINEMATIC_PERIODS, ...EXTRA_PERIODS]
const OVERRIDE_STORAGE_KEY = 'treePeriodOverride'

export function getPeriod(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60
  for (const p of PERIODS) {
    if (h >= p.from && h < p.to) return p.key
  }
  return 'noite'
}

// Além do horário real, o usuário pode fixar manualmente um cenário (o
// botão de trocar estação na árvore) — fica salvo no aparelho até ele
// escolher "automático" de novo, ciclando: automático → amanhecer → dia
// → pôr do sol → noite → chuva → neve → nublado → automático...
export function useTimeOfDay() {
  const [autoPeriod, setAutoPeriod] = useState(() => getPeriod())
  const [override, setOverride] = useState(() => {
    const saved = localStorage.getItem(OVERRIDE_STORAGE_KEY)
    return CYCLE_PERIODS.includes(saved) ? saved : null
  })

  useEffect(() => {
    // checa a cada minuto — barato o bastante pra não importar, e frequente
    // o bastante pra pegar a troca de período assim que ela acontece
    const id = setInterval(() => {
      setAutoPeriod((prev) => {
        const next = getPeriod()
        return prev === next ? prev : next
      })
    }, 60000)
    return () => clearInterval(id)
  }, [])

  function cycleOverride() {
    setOverride((prev) => {
      const idx = prev ? CYCLE_PERIODS.indexOf(prev) : -1
      const next = idx === CYCLE_PERIODS.length - 1 ? null : CYCLE_PERIODS[idx + 1]
      if (next) localStorage.setItem(OVERRIDE_STORAGE_KEY, next)
      else localStorage.removeItem(OVERRIDE_STORAGE_KEY)
      return next
    })
  }

  return { period: override ?? autoPeriod, isOverridden: override != null, cycleOverride }
}
