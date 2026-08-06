import { useEffect, useState } from 'react'

// Faixas de horário → cenário. Meia-noite cruza a faixa da noite (19:00–04:59),
// por isso ela é tratada à parte no fim.
const PERIODS = [
  { key: 'amanhecer', from: 5, to: 8 },
  { key: 'dia', from: 8, to: 17.5 },
  { key: 'por_do_sol', from: 17.5, to: 19 },
]
const ALL_PERIODS = ['amanhecer', 'dia', 'por_do_sol', 'noite']
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
// → pôr do sol → noite → automático...
export function useTimeOfDay() {
  const [autoPeriod, setAutoPeriod] = useState(() => getPeriod())
  const [override, setOverride] = useState(() => {
    const saved = localStorage.getItem(OVERRIDE_STORAGE_KEY)
    return ALL_PERIODS.includes(saved) ? saved : null
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
      const idx = prev ? ALL_PERIODS.indexOf(prev) : -1
      const next = idx === ALL_PERIODS.length - 1 ? null : ALL_PERIODS[idx + 1]
      if (next) localStorage.setItem(OVERRIDE_STORAGE_KEY, next)
      else localStorage.removeItem(OVERRIDE_STORAGE_KEY)
      return next
    })
  }

  return { period: override ?? autoPeriod, isOverridden: override != null, cycleOverride }
}
