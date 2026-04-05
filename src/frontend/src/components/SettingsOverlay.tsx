import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

const THEMES = [
  { key: "green", color: "#1db954", label: "Spotify Green" },
  { key: "red", color: "#e53935", label: "Blood Red" },
  { key: "blue", color: "#1565c0", label: "Electric Blue" },
  { key: "purple", color: "#7b1fa2", label: "Nebula Purple" },
  { key: "gold", color: "#f9a825", label: "Cyber Gold" },
];

export default function SettingsOverlay({ onClose }: Props) {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("writefy-theme") ?? "green";
  });

  function applyTheme(key: string, color: string) {
    setActiveTheme(key);
    document.documentElement.style.setProperty("--accent-color", color);
    localStorage.setItem("writefy-theme", key);
  }

  return (
    <div className="settings-overlay" data-ocid="settings.modal">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="settings-backdrop"
        onClick={onClose}
        role="presentation"
      />
      <div className="settings-panel">
        <button
          type="button"
          className="settings-close"
          onClick={onClose}
          aria-label="Close settings"
          data-ocid="settings.close.button"
        >
          <X size={18} />
        </button>

        <div>
          <h2 className="settings-title">Settings</h2>
        </div>

        <div>
          <p className="settings-section-label">Accent Color</p>
          <div className="theme-swatches">
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`theme-swatch${activeTheme === t.key ? " active" : ""}`}
                style={{ backgroundColor: t.color }}
                onClick={() => applyTheme(t.key, t.color)}
                title={t.label}
                aria-label={t.label}
                data-ocid={`settings.theme_${t.key}.button`}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="settings-section-label">About</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
            Writefy &mdash; Your cinematic writing workspace.
            <br />
            Version 9.0
          </p>
        </div>
      </div>
    </div>
  );
}
