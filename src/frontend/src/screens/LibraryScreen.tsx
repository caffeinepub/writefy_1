import { BookOpen, Film, LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface Props {
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
}: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="library-screen" data-ocid="library.section">
      <div className="library-header">
        <h1 className="library-title">Library</h1>
        <div className="library-header-actions">
          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              data-ocid="library.grid.toggle"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn${viewMode === "list" ? " active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
              data-ocid="library.list.toggle"
            >
              <List size={14} />
            </button>
          </div>
          <button
            type="button"
            className="add-icon-btn"
            onClick={onNewDoc}
            aria-label="New document"
            data-ocid="library.add.button"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {!isLoading && docs.length > 0 && (
        <p className="doc-count">
          {docs.length} {docs.length === 1 ? "project" : "projects"}
        </p>
      )}

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            color: "var(--muted)",
            fontSize: 14,
          }}
        >
          Loading...
        </div>
      )}

      {!isLoading && docs.length === 0 && (
        <div className="lib-empty" data-ocid="library.empty_state">
          <h3>No projects yet</h3>
          <p>Create your first screenplay or novel to get started.</p>
          <button
            type="button"
            className="primary-btn"
            onClick={onNewDoc}
            data-ocid="library.create.primary_button"
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>
      )}

      {!isLoading && docs.length > 0 && viewMode === "grid" && (
        <div className="library-grid" data-ocid="library.grid.list">
          {docs.map((doc, i) => (
            <button
              type="button"
              key={doc.id}
              className="library-card"
              onClick={() => onOpenDoc(doc.id)}
              data-ocid={`library.grid.item.${i + 1}`}
            >
              <div>
                <div className="card-icon">
                  {doc.formatType === "Novel" ? (
                    <BookOpen size={18} />
                  ) : (
                    <Film size={18} />
                  )}
                </div>
                <p className="card-type">{doc.formatType}</p>
                <p className="card-title">{doc.title}</p>
              </div>
              <p className="card-meta">{formatRelativeTime(doc.lastEdited)}</p>
            </button>
          ))}
        </div>
      )}

      {!isLoading && docs.length > 0 && viewMode === "list" && (
        <div className="library-list" data-ocid="library.list.list">
          {docs.map((doc, i) => (
            <button
              type="button"
              key={doc.id}
              className="list-card"
              onClick={() => onOpenDoc(doc.id)}
              data-ocid={`library.list.item.${i + 1}`}
            >
              <div className="list-icon">
                {doc.formatType === "Novel" ? (
                  <BookOpen size={20} />
                ) : (
                  <Film size={20} />
                )}
              </div>
              <div className="list-content">
                <p className="list-title">{doc.title}</p>
                <p className="list-meta">
                  {doc.formatType} &middot; {formatRelativeTime(doc.lastEdited)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
