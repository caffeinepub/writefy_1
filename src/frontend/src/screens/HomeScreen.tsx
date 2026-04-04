import { FileText, Pencil } from "lucide-react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface HomeScreenProps {
  docs: DocumentMeta[];
  isLoading: boolean;
  onOpenDoc: (id: string) => void;
  onNewDoc: () => void;
}

export default function HomeScreen({
  docs,
  isLoading,
  onOpenDoc,
  onNewDoc,
}: HomeScreenProps) {
  // Sort by lastEdited descending and take the most recent
  const sortedDocs = [...docs].sort(
    (a, b) => Number(b.lastEdited) - Number(a.lastEdited),
  );
  const resumeDoc = sortedDocs[0] ?? null;

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "20px",
      }}
    >
      {isLoading ? (
        <div
          style={{ padding: "60px 0", textAlign: "center" }}
          data-ocid="home.loading_state"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid #1A1A1A",
              borderTopColor: "var(--accent-color, #1DB954)",
              margin: "0 auto",
            }}
          />
        </div>
      ) : resumeDoc ? (
        <>
          {/* Section label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8a8a8a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Continue Writing
          </div>

          {/* Resume Card */}
          <div
            data-ocid="home.resume.card"
            style={{
              height: 180,
              background: "#0b0b0b",
              borderRadius: 24,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(29,185,84,0.3)",
              boxShadow:
                "0 0 20px rgba(29,185,84,0.1), 0 0 6px rgba(29,185,84,0.06)",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {resumeDoc.title}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent-color, #1DB954)",
                  background: "rgba(29,185,84,0.12)",
                  border: "1px solid rgba(29,185,84,0.25)",
                  borderRadius: 100,
                  padding: "3px 10px",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {resumeDoc.formatType || "Screenplay"}
              </span>
            </div>

            {/* Last edited */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={13} color="#8a8a8a" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#8a8a8a" }}>
                Last edited {formatRelativeTime(resumeDoc.lastEdited)}
              </span>
            </div>

            {/* Resume button */}
            <button
              type="button"
              onClick={() => onOpenDoc(resumeDoc.id)}
              data-ocid="home.resume.primary_button"
              style={{
                background: "var(--accent-color, #1DB954)",
                color: "#000",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Pencil size={14} />
              Resume Writing
            </button>
          </div>

          {/* Quick actions */}
          <div
            style={{
              marginTop: 24,
              fontSize: 11,
              fontWeight: 700,
              color: "#8a8a8a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </div>
          <button
            type="button"
            onClick={onNewDoc}
            data-ocid="home.new_doc.primary_button"
            style={{
              width: "100%",
              background: "transparent",
              border: "1px dashed #333",
              borderRadius: 14,
              padding: "16px 20px",
              color: "var(--accent-color, #1DB954)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            + Start something new
          </button>
        </>
      ) : (
        /* Empty state */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            textAlign: "center",
            gap: 12,
          }}
          data-ocid="home.empty_state"
        >
          <div style={{ fontSize: 48, marginBottom: 4 }}>🎬</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Welcome to Writefy
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8a8a8a",
              lineHeight: 1.6,
              maxWidth: 260,
            }}
          >
            Your writing journey starts here. Create your first screenplay or
            novel.
          </div>
          <button
            type="button"
            onClick={onNewDoc}
            data-ocid="home.create.primary_button"
            style={{
              marginTop: 8,
              background: "var(--accent-color, #1DB954)",
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start Writing
          </button>
        </div>
      )}
    </div>
  );
}
