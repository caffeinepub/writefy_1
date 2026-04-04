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

  const getDocIcon = (doc: DocumentMeta, size: number) => {
    const color = "var(--accent-color, #1DB954)";
    if (doc.formatType === "Novel") {
      return <BookOpen size={size} color={color} strokeWidth={1.5} />;
    }
    return <Film size={size} color={color} strokeWidth={1.5} />;
  };

  return (
    <div style={{ minHeight: "100%", paddingBottom: 24 }}>
      {/* Centered content container */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            paddingBottom: 16,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
            Library
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                  viewMode === "grid"
                    ? "var(--accent-color, #1DB954)"
                    : "#1A1A1A",
                border: viewMode === "grid" ? "none" : "1px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Grid view"
            >
              <LayoutGrid
                size={15}
                color={viewMode === "grid" ? "#000" : "#8a8a8a"}
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
                  viewMode === "list"
                    ? "var(--accent-color, #1DB954)"
                    : "#1A1A1A",
                border: viewMode === "list" ? "none" : "1px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="List view"
            >
              <List
                size={15}
                color={viewMode === "list" ? "#000" : "#8a8a8a"}
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
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 16,
          }}
        >
          {sorted.length} {sorted.length === 1 ? "project" : "projects"}
        </div>

        {isLoading ? (
          <div
            style={{ padding: "40px 0", textAlign: "center" }}
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
            style={{ padding: "40px 0", textAlign: "center" }}
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
          /* GRID MODE */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
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
                  borderRadius: 18,
                  background: "#121212",
                  border: "1px solid rgba(29,185,84,0.12)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                  textAlign: "left",
                  minHeight: 140,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(29,185,84,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    flexShrink: 0,
                  }}
                >
                  {getDocIcon(doc, 20)}
                </div>

                {/* Type label */}
                <div
                  style={{
                    fontSize: 12,
                    color: "#8a8a8a",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  {doc.formatType || "Screenplay"}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    marginBottom: 6,
                    flex: 1,
                  }}
                >
                  {doc.title}
                </div>

                {/* Meta */}
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formatRelativeTime(doc.lastEdited)}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* LIST MODE */
          <div
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
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
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#121212",
                  border: "1px solid rgba(255,255,255,0.06)",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  minHeight: 72,
                }}
              >
                {/* Icon square */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#1e1e1e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {getDocIcon(doc, 20)}
                </div>

                {/* Title + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: 4,
                    }}
                  >
                    {doc.title}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    {doc.formatType || "Screenplay"} •{" "}
                    {formatRelativeTime(doc.lastEdited)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
