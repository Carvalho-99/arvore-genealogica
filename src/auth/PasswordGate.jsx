import { useState } from 'react'
import { APP_PASSWORD } from './password'

const STORAGE_KEY = 'treeUnlocked'
const base = import.meta.env.BASE_URL

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
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-6" style={{ background: '#0b0902' }}>
      <img
        src={`${base}hero.jpg`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="hero-vignette" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xs rounded-2xl border border-amber-100/15 bg-black/55 p-7 text-center shadow-2xl backdrop-blur-md"
      >
        <h1 className="font-serif-display text-lg text-amber-50">
          Árvore da Família Mostafá
        </h1>
        <p className="mb-4 mt-1 text-sm text-amber-100/60">
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
          className="form-input text-center"
          placeholder="Senha"
        />
        {error && <p className="mt-2 text-sm text-red-300">Senha incorreta.</p>}
        <button type="submit" className="btn-gold mt-4 w-full">
          Entrar
        </button>
      </form>
    </div>
  )
}
