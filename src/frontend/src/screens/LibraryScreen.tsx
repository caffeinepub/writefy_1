import { BookOpen, Film, LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface LibraryScreenProps {
  docs: DocumentMeta[];
  isLoading: boolean;
  onOpenDoc: (id: string) => void;
  onNewDoc: () => void;
}

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sorted = [...docs].sort(
    (a, b) => Number(b.lastEdited) - Number(a.lastEdited),
  );

  const getDocIcon = (doc: DocumentMeta, size: number, color: string) => {
    if (doc.formatType === "Novel") {
      return <BookOpen size={size} color={color} strokeWidth={1.5} />;
    }
    return <Film size={size} color={color} strokeWidth={1.5} />;
  };

  return (
    <div style={{ background: "#000", minHeight: "100%" }}>
      {/* Inline header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 12px",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Library
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Grid toggle */}
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            data-ocid="library.grid.toggle"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                viewMode === "grid" ? "rgba(29,185,84,0.15)" : "transparent",
              border:
                viewMode === "grid"
                  ? "1px solid rgba(29,185,84,0.3)"
                  : "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Grid view"
          >
            <LayoutGrid
              size={15}
              color={
                viewMode === "grid" ? "var(--accent-color, #1DB954)" : "#8a8a8a"
              }
            />
          </button>

          {/* List toggle */}
          <button
            type="button"
            onClick={() => setViewMode("list")}
            data-ocid="library.list.toggle"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                viewMode === "list" ? "rgba(29,185,84,0.15)" : "transparent",
              border:
                viewMode === "list"
                  ? "1px solid rgba(29,185,84,0.3)"
                  : "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="List view"
          >
            <List
              size={15}
              color={
                viewMode === "list" ? "var(--accent-color, #1DB954)" : "#8a8a8a"
              }
            />
          </button>

          {/* New doc button */}
          <button
            type="button"
            onClick={onNewDoc}
            data-ocid="library.create.primary_button"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--accent-color, #1DB954)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="New document"
          >
            <Plus size={16} color="#000" />
          </button>
        </div>
      </div>

      {/* Doc count */}
      <div style={{ fontSize: 12, color: "#8a8a8a", padding: "0 16px 12px" }}>
        {sorted.length} {sorted.length === 1 ? "project" : "projects"}
      </div>

      {isLoading ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="library.loading_state"
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid #1A1A1A",
              borderTopColor: "var(--accent-color, #1DB954)",
              margin: "0 auto",
            }}
          />
        </div>
      ) : sorted.length === 0 ? (
        <div
          style={{ padding: "40px 20px", textAlign: "center" }}
          data-ocid="library.empty_state"
        >
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>📚</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            No projects yet
          </div>
          <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 18 }}>
            Tap + to create your first screenplay or novel.
          </div>
          <button
            type="button"
            onClick={onNewDoc}
            data-ocid="library.empty.primary_button"
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              background: "var(--accent-color, #1DB954)",
              color: "#000",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
            }}
          >
            New Project
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID MODE — 2:3 poster ratio */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 15,
            padding: "0 20px 20px",
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
                aspectRatio: "2 / 3",
                borderRadius: 20,
                background: "#121212",
                border: "1px solid #1a1a1a",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: 0,
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

              {/* Icon area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getDocIcon(
                  doc,
                  40,
                  `${CARD_ACCENTS[idx % CARD_ACCENTS.length]}55`,
                )}
              </div>

              {/* Bottom overlay */}
              <div
                style={{
                  padding: "12px 10px",
                  background: "rgba(0,0,0,0.5)",
                  borderTop: "1px solid #1a1a1a",
                }}
              >
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
                    textAlign: "left",
                  }}
                >
                  {doc.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#8a8a8a",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                >
                  {doc.formatType || "Screenplay"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#5a5a5a",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formatRelativeTime(doc.lastEdited)}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* LIST MODE */
        <div
          style={{ padding: "0 16px", paddingBottom: 16 }}
          data-ocid="library.list"
        >
          {sorted.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onOpenDoc(doc.id)}
              data-ocid={`library.script.item.${idx + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 0",
                borderBottom: "1px solid #1a1a1a",
                width: "100%",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                border: "none",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getDocIcon(doc, 18, CARD_ACCENTS[idx % CARD_ACCENTS.length])}
              </div>

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: 3,
                  }}
                >
                  {doc.title}
                </div>
                <div style={{ fontSize: 12, color: "#8a8a8a" }}>
                  {doc.formatType || "Screenplay"} •{" "}
                  {formatRelativeTime(doc.lastEdited)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
