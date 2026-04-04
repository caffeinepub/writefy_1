interface DeleteConfirmProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({
  title,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <div
      className="confirm-overlay"
      role="alertdialog"
      aria-modal="true"
      data-ocid="delete.dialog"
    >
      <div className="confirm-panel">
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "8px",
            }}
          >
            Delete Script?
          </div>
          <div style={{ fontSize: "14px", color: "#8A8A8A", lineHeight: 1.5 }}>
            "{title}" will be permanently deleted. This action cannot be undone.
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "transparent",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            data-ocid="delete.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            data-ocid="delete.confirm_button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
