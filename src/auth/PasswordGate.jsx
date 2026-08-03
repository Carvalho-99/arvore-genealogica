import { useState } from 'react'
import { APP_PASSWORD } from './password'

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
    <div className="flex min-h-svh items-center justify-center bg-stone-50 px-6 dark:bg-stone-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-sm dark:bg-stone-800"
      >
        <h1 className="mb-1 text-center text-lg font-semibold text-stone-800 dark:text-stone-100">
          Árvore da Família Mostafá
        </h1>
        <p className="mb-4 text-center text-sm text-stone-500 dark:text-stone-400">
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
          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
          placeholder="Senha"
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">Senha incorreta.</p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-stone-800 py-3 text-base font-medium text-white active:bg-stone-700 dark:bg-stone-100 dark:text-stone-900"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
