export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="max-h-[85svh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-cyan-400/15 bg-slate-900/90 p-5 shadow-[0_0_40px_-8px_rgba(34,211,238,0.25)] backdrop-blur-md sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xl leading-none text-slate-400 active:bg-slate-800"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
