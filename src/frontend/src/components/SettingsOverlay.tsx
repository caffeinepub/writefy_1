import { Cloud, CloudOff, LogOut, Share2, Shield, X } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SettingsOverlayProps {
  onClose: () => void;
}

const THEMES = [
  { name: "Spotify Green", color: "#1DB954" },
  { name: "Blood Red", color: "#E53E3E" },
  { name: "Electric Blue", color: "#3B82F6" },
  { name: "Nebula Purple", color: "#8B5CF6" },
  { name: "Cyber Gold", color: "#F59E0B" },
];

function applyTheme(color: string) {
  localStorage.setItem("writefy-theme", color);
  document.documentElement.style.setProperty("--accent-color", color);
  // Update scrollbar thumb color via a style tag
  const existing = document.getElementById("writefy-theme-style");
  const style =
    existing ??
    (() => {
      const el = document.createElement("style");
      el.id = "writefy-theme-style";
      document.head.appendChild(el);
      return el;
    })();
  style.textContent = `::-webkit-scrollbar-thumb { background: ${color} !important; } * { scrollbar-color: ${color} #000 !important; }`;
}

export default function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const { identity, login, clear, isLoggingIn, isLoginSuccess } =
    useInternetIdentity();

  const currentTheme = localStorage.getItem("writefy-theme") ?? "#1DB954";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Writefy",
          text: "Check out Writefy \u2013 a professional screenplay writing app!",
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const isConnected = isLoginSuccess || !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <div
      className="settings-overlay"
      aria-modal="true"
      aria-label="Settings"
      data-ocid="settings.modal"
    >
      <div className="settings-panel">
        {/* Header */}
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

        {/* Theme Selector */}
        <div style={{ padding: "16px 24px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#8A8A8A",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Theme
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {THEMES.map((theme) => (
              <button
                key={theme.color}
                type="button"
                title={theme.name}
                onClick={() => applyTheme(theme.color)}
                data-ocid="settings.theme.toggle"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: theme.color,
                  border:
                    currentTheme === theme.color
                      ? "3px solid #fff"
                      : "3px solid transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow:
                    currentTheme === theme.color
                      ? `0 0 10px ${theme.color}`
                      : "none",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#8A8A8A",
              marginTop: 8,
            }}
          >
            {THEMES.find((t) => t.color === currentTheme)?.name ??
              "Spotify Green"}
          </div>
        </div>

        <div
          style={{ height: "1px", background: "#1A1A1A", margin: "0 24px 8px" }}
        />

        {/* Cloud Vault (Internet Identity) */}
        <div style={{ padding: "16px 24px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#8A8A8A",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Cloud Vault
          </div>

          {isConnected ? (
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid #1A1A1A",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <Cloud size={18} color="var(--accent-color, #1DB954)" />
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    Connected
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8A8A8A",
                      marginTop: 1,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {shortPrincipal}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={clear}
                data-ocid="settings.disconnect.button"
                style={{
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 8,
                  border: "1px solid #2A2A2A",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="settings.login.button"
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: "var(--accent-color, #1DB954)",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: isLoggingIn ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isLoggingIn ? 0.7 : 1,
              }}
            >
              {isLoggingIn ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid #000",
                      borderTopColor: "transparent",
                    }}
                  />
                  Connecting...
                </>
              ) : (
                <>
                  <CloudOff size={16} />
                  Connect with Internet Identity
                </>
              )}
            </button>
          )}
        </div>

        <div
          style={{ height: "1px", background: "#1A1A1A", margin: "0 24px 8px" }}
        />

        {/* Permissions */}
        <div style={{ padding: "16px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
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
              <Shield size={18} color="var(--accent-color, #1DB954)" />
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
                  background: "var(--accent-color, #1DB954)",
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
          <Share2 size={20} color="var(--accent-color, #1DB954)" />
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
