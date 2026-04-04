import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentMeta } from "../backend.d";
import DeleteConfirm from "../components/DeleteConfirm";
import MenuOverlay from "../components/MenuOverlay";
import ScreenplayEditor from "../components/ScreenplayEditor";
import {
  useDeleteDocument,
  useGetDocument,
  useUpdateDocument,
} from "../hooks/useQueries";
import { idbSaveScript } from "../utils/idb";

interface CreateScreenProps {
  activeDocId: string | null;
  onDocumentDeleted: () => void;
  allDocs: DocumentMeta[];
  isInitialized: boolean;
  menuTrigger?: number;
  onContentUpdate?: (content: string) => void;
}

export default function CreateScreen({
  activeDocId,
  onDocumentDeleted,
  allDocs: _allDocs,
  isInitialized,
  menuTrigger,
  onContentUpdate,
}: CreateScreenProps) {
  const { data: document } = useGetDocument(activeDocId);
  const updateDoc = useUpdateDocument();
  const deleteDoc = useDeleteDocument();

  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [localContent, setLocalContent] = useState("");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMenuTrigger = useRef(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset content on doc id change
  useEffect(() => {
    if (document) {
      setLocalContent(document.content);
      onContentUpdate?.(document.content);
    }
  }, [document?.id]);

  useEffect(() => {
    if (menuTrigger && menuTrigger !== prevMenuTrigger.current) {
      prevMenuTrigger.current = menuTrigger;
      setShowMenu(true);
    }
  }, [menuTrigger]);

  const doSave = useCallback(
    async (content: string) => {
      if (!activeDocId || !document) return;
      try {
        await updateDoc.mutateAsync({
          id: activeDocId,
          title: document.title,
          content,
        });
        setIsSaved(true);
      } catch {
        // save failed silently
      }
    },
    [activeDocId, document, updateDoc],
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setLocalContent(content);
      setIsSaved(false);
      onContentUpdate?.(content);
      // Save to IndexedDB immediately for offline
      if (activeDocId && document) {
        idbSaveScript(activeDocId, document.title, content).catch(() => {});
      }
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        doSave(content);
      }, 30000);
    },
    [doSave, activeDocId, document, onContentUpdate],
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const handleExportPDF = () => {
    if (!document) return;
    setShowMenu(false);
    const content = localContent || document.content;
    const lines = content.split("\n");
    const htmlLines = lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("INT.") || trimmed.startsWith("EXT.")) {
          return `<p style="font-weight:bold;text-transform:uppercase;margin:16px 0 4px">${trimmed}</p>`;
        }
        if (
          trimmed === trimmed.toUpperCase() &&
          trimmed.length > 0 &&
          /^[A-Z\s]+$/.test(trimmed)
        ) {
          return `<p style="text-align:center;font-weight:bold;text-transform:uppercase;margin:16px auto 0;width:60%">${trimmed}</p>`;
        }
        if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
          return `<p style="text-align:center;font-style:italic;margin:0 auto;width:50%">${trimmed}</p>`;
        }
        return `<p style="margin:0 auto 8px;width:80%">${trimmed || "&nbsp;"}</p>`;
      })
      .join("");

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(
        `<!DOCTYPE html><html><head><title>${document.title}</title><style>body{font-family:'Courier New',monospace;font-size:12pt;line-height:1.5;padding:72px;max-width:8.5in;margin:0 auto;color:#000;background:#fff}p{margin-bottom:8px}@media print{body{padding:1in}}</style></head><body>${htmlLines}</body></html>`,
      );
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  const handleImport = () => {
    setShowMenu(false);
    const input = globalThis.document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.fountain";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      setLocalContent(text);
      setIsSaved(false);
      onContentUpdate?.(text);
      if (activeDocId && document) {
        idbSaveScript(activeDocId, document.title, text).catch(() => {});
      }
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      doSave(text);
    };
    input.click();
  };

  const handleShare = async () => {
    setShowMenu(false);
    if (!document) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: localContent || document.content,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(localContent || document.content);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeDocId) return;
    await deleteDoc.mutateAsync(activeDocId);
    setShowDelete(false);
    setShowMenu(false);
    onDocumentDeleted();
  };

  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#8A8A8A",
          flexDirection: "column",
          gap: 12,
          padding: 24,
          minHeight: "calc(100dvh - 176px)",
        }}
        data-ocid="create.loading_state"
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #1A1A1A",
            borderTopColor: "var(--accent-color, #1DB954)",
          }}
        />
        <div style={{ fontSize: 14, color: "#8A8A8A" }}>Loading script...</div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(calc(-50% + 64px))",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        <div
          className={`save-dot${isSaved ? " saved" : ""}`}
          title={isSaved ? "Saved" : "Unsaved changes"}
          data-ocid={
            isSaved ? "create.save.success_state" : "create.save.loading_state"
          }
        />
      </div>

      {showMenu && (
        <MenuOverlay
          onClose={() => setShowMenu(false)}
          onExport={handleExportPDF}
          onImport={handleImport}
          onShare={handleShare}
          onDelete={() => {
            setShowMenu(false);
            setShowDelete(true);
          }}
        />
      )}

      {showDelete && (
        <DeleteConfirm
          title={document?.title ?? "Untitled Script"}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <ScreenplayEditor
        document={document ?? null}
        onContentChange={handleContentChange}
        isSaved={isSaved}
      />
    </>
  );
}
