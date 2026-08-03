import { useState } from 'react'
import { APP_PASSWORD } from './password'
import HolographicBackground from '../components/layout/HolographicBackground'

const STORAGE_KEY = 'treeUnlocked'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (input === APP_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) return children

  return (
    <div className="flex min-h-svh items-center justify-center px-6 text-slate-100">
      <HolographicBackground />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-6 shadow-[0_0_35px_-8px_rgba(34,211,238,0.25)] backdrop-blur-md"
      >
        <h1 className="mb-1 text-center text-lg font-semibold text-slate-100">
          Árvore da Família Mostafá
        </h1>
        <p className="mb-4 text-center text-sm text-slate-400">
          Digite a senha pra entrar
        </p>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-3 text-base text-slate-100 outline-none focus:border-cyan-400/60"
          placeholder="Senha"
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">Senha incorreta.</p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-amber-300 py-3 text-base font-medium text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)] active:opacity-90"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
