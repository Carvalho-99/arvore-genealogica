import { useEffect, useState } from 'react'

// Faixas de horário → cenário. Meia-noite cruza a faixa da noite (19:00–04:59),
// por isso ela é tratada à parte no fim.
const PERIODS = [
  { key: 'amanhecer', from: 5, to: 8 },
  { key: 'dia', from: 8, to: 17.5 },
  { key: 'por_do_sol', from: 17.5, to: 19 },
]

export function getPeriod(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60
  for (const p of PERIODS) {
    if (h >= p.from && h < p.to) return p.key
  }
  return 'noite'
}

export function useTimeOfDay() {
  const [period, setPeriod] = useState(() => getPeriod())

  useEffect(() => {
    // checa a cada minuto — barato o bastante pra não importar, e frequente
    // o bastante pra pegar a troca de período assim que ela acontece
    const id = setInterval(() => {
      setPeriod((prev) => {
        const next = getPeriod()
        return prev === next ? prev : next
      })
    }, 60000)
    return () => clearInterval(id)
  }, [])

  return period
}
