import { RedBtn, GhostBtn } from './SharedUI'
import { XIcon, SaveIcon } from './icons/Icons'

type ModalProps = {
  title: string
  onClose: () => void
  onSave: () => void
  children: React.ReactNode
}

export function Modal({ title, onClose, onSave, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="border border-neutral-700 rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-base font-bold uppercase tracking-wide text-white"
            style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 transition-colors"
          >
            <XIcon />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="flex justify-end gap-3 mt-6">
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <RedBtn onClick={onSave}>
            <SaveIcon /> Save
          </RedBtn>
        </div>
      </div>
    </div>
  )
}

type ConfirmDeleteProps = {
  label: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDelete({
  label,
  onClose,
  onConfirm,
}: ConfirmDeleteProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="border border-neutral-700 rounded-xl p-6 w-full max-w-sm"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <h3
          className="text-base font-bold uppercase tracking-wide mb-2"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Delete {label}?
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-semibold text-white"
            style={{ backgroundColor: '#E8102A' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#b50d22')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#E8102A')
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
