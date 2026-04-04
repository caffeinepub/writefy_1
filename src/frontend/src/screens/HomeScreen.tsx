import { FileText, Plus } from "lucide-react";
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
  const recentDocs = [...docs]
    .sort((a, b) => Number(b.lastEdited) - Number(a.lastEdited))
    .slice(0, 6);

  return (
    <div style={{ background: "#000", minHeight: "100%" }}>
      <div className="page-title">Home</div>
      <div className="page-subtitle">Your recent screenplays</div>

      {isLoading ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="home.loading_state"
        >
          <div style={{ color: "#8A8A8A", fontSize: 14 }}>Loading...</div>
        </div>
      ) : recentDocs.length === 0 ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="home.empty_state"
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎬</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            No scripts yet
          </div>
          <div style={{ fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            Start your first screenplay on the Create tab.
          </div>
          <button
            type="button"
            onClick={onNewDoc}
            style={{
              background: "#1DB954",
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
            data-ocid="home.create.primary_button"
          >
            New Script
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {recentDocs.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              className="script-card"
              style={{
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                border: "1px solid #1A1A1A",
              }}
              onClick={() => onOpenDoc(doc.id)}
              data-ocid={`home.script.item.${idx + 1}`}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#1A1A1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} color="#1DB954" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="script-card-title"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doc.title}
                  </div>
                  <div className="script-card-meta">
                    Screenplay • {formatRelativeTime(doc.lastEdited)}
                  </div>
                </div>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={onNewDoc}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 16px",
              background: "transparent",
              border: "1px dashed #333",
              borderRadius: 12,
              color: "#1DB954",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              marginTop: 4,
            }}
            data-ocid="home.new_script.button"
          >
            <Plus size={16} />
            New Script
          </button>
        </div>
      )}
    </div>
  );
}
