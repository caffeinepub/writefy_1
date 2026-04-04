import { BookOpen, Film, Plus } from "lucide-react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface LibraryScreenProps {
  docs: DocumentMeta[];
  isLoading: boolean;
  onOpenDoc: (id: string) => void;
  onNewDoc: () => void;
}

// Accent colors for card top bands — cycles through these
const CARD_ACCENTS = [
  "var(--accent-color, #1DB954)",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#E53E3E",
  "#06B6D4",
];

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <BookOpen size={22} color="var(--accent-color, #1DB954)" />
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            Library
          </span>
        </div>
        <button
          type="button"
          onClick={onNewDoc}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "var(--accent-color, #1DB954)",
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
      <div
        style={{
          fontSize: 13,
          color: "#8A8A8A",
          padding: "2px 16px 16px",
        }}
      >
        {sorted.length} screenplay{sorted.length !== 1 ? "s" : ""}
      </div>

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
          <div style={{ fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            Create your first screenplay to get started.
          </div>
          <button
            type="button"
            onClick={onNewDoc}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              background: "var(--accent-color, #1DB954)",
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
            data-ocid="library.empty.primary_button"
          >
            New Script
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            padding: "0 16px 16px",
          }}
          data-ocid="library.list"
        >
          {sorted.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onOpenDoc(doc.id)}
              data-ocid={`library.script.item.${idx + 1}`}
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(29,185,84,0.12)",
                borderRadius: 12,
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                height: 130,
              }}
            >
              {/* Top accent band */}
              <div
                style={{
                  height: 4,
                  background: CARD_ACCENTS[idx % CARD_ACCENTS.length],
                  flexShrink: 0,
                }}
              />

              {/* Card body */}
              <div
                style={{
                  flex: 1,
                  padding: "10px 10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Film icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#1A1A1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Film
                    size={14}
                    color={CARD_ACCENTS[idx % CARD_ACCENTS.length]}
                  />
                </div>

                {/* Title + meta */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      marginBottom: 4,
                    }}
                  >
                    {doc.title}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#6F6F6F", marginBottom: 3 }}
                  >
                    Screenplay
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6F6F6F",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {formatRelativeTime(doc.lastEdited)}
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
