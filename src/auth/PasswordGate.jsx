import { useState } from 'react'
import { APP_PASSWORD } from './password'
import AppBackground from '../components/layout/AppBackground'

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
    <div className="flex min-h-svh items-center justify-center px-6 text-stone-800">
      <AppBackground />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl border border-amber-800/15 bg-amber-50/85 p-6 shadow-lg backdrop-blur-md"
      >
        <h1 className="mb-1 text-center text-lg font-semibold text-stone-800">
          Árvore da Família Mostafá
        </h1>
        <p className="mb-4 text-center text-sm text-stone-500">
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
          className="w-full rounded-lg border border-amber-800/25 bg-white/70 px-4 py-3 text-base text-stone-800 outline-none focus:border-green-700/60"
          placeholder="Senha"
        />
        {error && <p className="mt-2 text-sm text-red-600">Senha incorreta.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-700 to-green-600 py-3 text-base font-medium text-amber-50 shadow active:opacity-90"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
