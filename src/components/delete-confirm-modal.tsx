type DeleteConfirmModalProps = {
  isOpen: boolean;
  subscriptionName?: string;
  onClose: () => void;
  onConfirm?: () => void;
};

const DeleteConfirmModal = ({
  isOpen,
  subscriptionName = "this subscription",
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div className="modal-card modal-confirm">
        <div className="modal-header">
          <h2 id="delete-modal-title">Delete subscription</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p id="delete-modal-desc" className="modal-body">
          Are you sure you want to delete <strong>{subscriptionName}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-actions modal-actions-end">
          <button type="button" className="ghost-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
