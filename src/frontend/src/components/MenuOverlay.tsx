import { FileDown, Share2, Trash2, Upload, X } from "lucide-react";

interface MenuOverlayProps {
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export default function MenuOverlay({
  onClose,
  onExport,
  onImport,
  onShare,
  onDelete,
}: MenuOverlayProps) {
  return (
    <div
      className="menu-overlay"
      aria-modal="true"
      aria-label="Document options"
      data-ocid="menu.modal"
    >
      <div className="menu-panel">
        <div
          style={{
            padding: "0 24px 16px",
            borderBottom: "1px solid #1A1A1A",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
            Document
          </div>
          <div style={{ fontSize: "12px", color: "#8A8A8A", marginTop: "4px" }}>
            Options
          </div>
        </div>

        <button
          type="button"
          className="menu-item"
          onClick={onExport}
          data-ocid="menu.export.button"
        >
          <FileDown />
          Export PDF
        </button>

        <button
          type="button"
          className="menu-item"
          onClick={onImport}
          data-ocid="menu.import.button"
        >
          <Upload />
          Import
        </button>

        <button
          type="button"
          className="menu-item"
          onClick={onShare}
          data-ocid="menu.share.button"
        >
          <Share2 />
          Share
        </button>

        <div
          style={{ height: "1px", background: "#1A1A1A", margin: "8px 0" }}
        />

        <button
          type="button"
          className="menu-item danger"
          onClick={onDelete}
          data-ocid="menu.delete.button"
        >
          <Trash2 />
          Delete
        </button>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          className="menu-item"
          onClick={onClose}
          style={{ marginTop: "auto" }}
          data-ocid="menu.close_button"
        >
          <X style={{ color: "#8A8A8A" }} />
          Close
        </button>
      </div>

      {/* Backdrop click to close */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "transparent",
          border: "none",
          cursor: "default",
        }}
      />
    </div>
  );
}
