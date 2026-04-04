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

interface CreateScreenProps {
  activeDocId: string | null;
  onDocumentDeleted: () => void;
  allDocs: DocumentMeta[];
  isInitialized: boolean;
  menuTrigger?: number;
}

export default function CreateScreen({
  activeDocId,
  onDocumentDeleted,
  allDocs: _allDocs,
  isInitialized,
  menuTrigger,
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
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        doSave(content);
      }, 30000);
    },
    [doSave],
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const handleExport = () => {
    if (!document) return;
    setShowMenu(false);
    const blob = new Blob([localContent || document.content], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #1A1A1A",
            borderTopColor: "#1DB954",
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
          onExport={handleExport}
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
