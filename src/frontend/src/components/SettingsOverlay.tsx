import { Share2, Shield, X } from "lucide-react";

interface SettingsOverlayProps {
  onClose: () => void;
}

export default function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Writefy",
          text: "Check out Writefy – a professional screenplay writing app!",
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div
      className="settings-overlay"
      aria-modal="true"
      aria-label="Settings"
      data-ocid="settings.modal"
    >
      <div className="settings-panel">
        <div
          style={{
            padding: "0 24px 16px",
            borderBottom: "1px solid #1A1A1A",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
            Settings
          </div>
        </div>

        <div style={{ padding: "16px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={18} color="#1DB954" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                Permission Manager
              </div>
              <div style={{ fontSize: 12, color: "#8A8A8A", marginTop: 2 }}>
                Manage app permissions
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div
                style={{
                  width: 28,
                  height: 16,
                  borderRadius: 8,
                  background: "#1DB954",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#000",
                    position: "absolute",
                    right: 2,
                    top: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "#1A1A1A", margin: "0 24px 8px" }}
        />

        <button
          type="button"
          className="menu-item"
          onClick={handleShare}
          data-ocid="settings.share.button"
        >
          <Share2 size={20} color="#1DB954" />
          Share with Friends
        </button>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          className="menu-item"
          onClick={onClose}
          style={{ marginTop: "auto" }}
          data-ocid="settings.close_button"
        >
          <X style={{ color: "#8A8A8A" }} size={20} />
          Close
        </button>
      </div>

      {/* Backdrop click to close */}
      <button
        type="button"
        aria-label="Close settings"
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
