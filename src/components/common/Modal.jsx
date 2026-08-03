export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="max-h-[85svh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-amber-800/15 bg-amber-50/95 p-5 shadow-xl backdrop-blur-md sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xl leading-none text-stone-400 active:bg-amber-100"
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
