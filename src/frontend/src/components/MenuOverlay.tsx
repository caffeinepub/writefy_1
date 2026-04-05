import { Download, Share2, Trash2, Upload } from "lucide-react";

interface Props {
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
}: Props) {
  return (
    <div className="menu-overlay" data-ocid="menu.modal">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div className="menu-backdrop" onClick={onClose} role="presentation" />
      <div className="menu-panel">
        <button
          type="button"
          className="menu-item"
          onClick={onImport}
          data-ocid="menu.import.button"
        >
          <Upload size={18} />
          Import
        </button>
        <button
          type="button"
          className="menu-item"
          onClick={onExport}
          data-ocid="menu.export.button"
        >
          <Download size={18} />
          Export (.txt)
        </button>
        <button
          type="button"
          className="menu-item"
          onClick={onShare}
          data-ocid="menu.share.button"
        >
          <Share2 size={18} />
          Share
        </button>
        <div className="menu-separator" />
        <button
          type="button"
          className="menu-item danger"
          onClick={onDelete}
          data-ocid="menu.delete.delete_button"
        >
          <Trash2 size={18} />
          Delete Script
        </button>
      </div>
    </div>
  );
}
