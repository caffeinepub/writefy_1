interface Props {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ title, onConfirm, onCancel }: Props) {
  return (
    <div className="confirm-overlay" data-ocid="delete.dialog">
      <div className="confirm-panel">
        <h2 className="confirm-title">Delete Script?</h2>
        <p className="confirm-body">
          &ldquo;{title}&rdquo; will be permanently deleted. This action cannot
          be undone.
        </p>
        <div className="confirm-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            data-ocid="delete.cancel.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={onConfirm}
            data-ocid="delete.confirm.delete_button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
