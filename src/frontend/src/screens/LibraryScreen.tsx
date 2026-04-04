import { FileText, Plus } from "lucide-react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface LibraryScreenProps {
  docs: DocumentMeta[];
  isLoading: boolean;
  onOpenDoc: (id: string) => void;
  onNewDoc: () => void;
}

export default function LibraryScreen({
  docs,
  isLoading,
  onOpenDoc,
  onNewDoc,
}: LibraryScreenProps) {
  const sorted = [...docs].sort(
    (a, b) => Number(b.lastEdited) - Number(a.lastEdited),
  );

  return (
    <div style={{ background: "#000", minHeight: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 8px",
        }}
      >
        <div className="page-title" style={{ padding: 0 }}>
          Library
        </div>
        <button
          type="button"
          onClick={onNewDoc}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#1DB954",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          data-ocid="library.create.primary_button"
        >
          <Plus size={20} color="#000" />
        </button>
      </div>
      <div className="page-subtitle">All your screenplays</div>

      {isLoading ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="library.loading_state"
        >
          <div style={{ color: "#8A8A8A", fontSize: 14 }}>Loading...</div>
        </div>
      ) : sorted.length === 0 ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="library.empty_state"
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📚</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            No scripts in library
          </div>
          <div style={{ fontSize: 13, color: "#8A8A8A" }}>
            Your screenplays will appear here.
          </div>
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
          {sorted.map((doc, idx) => (
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
              data-ocid={`library.script.item.${idx + 1}`}
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
        </div>
      )}
    </div>
  );
}
