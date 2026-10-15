import type { ReactNode } from 'react'

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="modal-back" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="card-h">
          <h3>{title}</h3>
          <button className="btn ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="card-b">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onClose,
}: {
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>
      <div className="row">
        <button className="btn danger" type="button" onClick={onConfirm}>
          Confirm
        </button>
        <button className="btn" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
