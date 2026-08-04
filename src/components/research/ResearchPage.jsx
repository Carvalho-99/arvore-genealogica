import { useNavigate } from 'react-router-dom'
import ResearchHubPage from './ResearchHubPage'

export default function ResearchPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-[#0b0902]">
      <div
        className="sticky top-0 z-10 flex items-center gap-3 bg-[#0b0902]/90 px-4 backdrop-blur-md"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: '12px' }}
      >
        <button onClick={() => navigate('/arvore')} className="glass-btn" aria-label="Voltar pra árvore">
          ⟵
        </button>
        <p className="font-serif-display text-sm tracking-wide text-amber-100/70">Voltar pra árvore</p>
      </div>
      <div className="mx-auto max-w-md rounded-t-3xl bg-amber-50/95 px-4 pb-16 pt-6 text-stone-800">
        <ResearchHubPage />
      </div>
    </div>
  )
}
