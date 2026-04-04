import { BookOpen, Film, X } from "lucide-react";

interface NewDocModalProps {
  onSelect: (type: "Novel" | "Screenplay") => void;
  onClose: () => void;
}

export default function NewDocModal({ onSelect, onClose }: NewDocModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(0,0,0,0.85)",
      }}
      data-ocid="new_doc.modal"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 36,
          height: 36,
          background: "#1a1a1a",
          border: "none",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
        }}
        data-ocid="new_doc.close_button"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Title */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#ffffff",
          marginBottom: 32,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        What are you writing?
      </div>

      {/* Type cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* NOVEL card */}
        <button
          type="button"
          onClick={() => onSelect("Novel")}
          data-ocid="new_doc.novel.card"
          style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: 20,
            padding: "32px 20px",
            width: 140,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid var(--accent-color, #1DB954)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 16px rgba(29,185,84,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid #1a1a1a";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          <BookOpen
            size={40}
            color="var(--accent-color, #1DB954)"
            strokeWidth={1.5}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            NOVEL
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#8a8a8a",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Long-form narrative
          </div>
        </button>

        {/* SCREENPLAY card */}
        <button
          type="button"
          onClick={() => onSelect("Screenplay")}
          data-ocid="new_doc.screenplay.card"
          style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: 20,
            padding: "32px 20px",
            width: 140,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid var(--accent-color, #1DB954)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 16px rgba(29,185,84,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid #1a1a1a";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          <Film
            size={40}
            color="var(--accent-color, #1DB954)"
            strokeWidth={1.5}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SCREENPLAY
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#8a8a8a",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Script format
          </div>
        </button>
      </div>
    </div>
  );
}
