import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import type { Document, DocumentMeta } from "../backend.d";
import DeleteConfirm from "../components/DeleteConfirm";
import MenuOverlay from "../components/MenuOverlay";
import ScreenplayEditor from "../components/ScreenplayEditor";
import {
  useDeleteDocument,
  useGetDocument,
  useUpdateDocument,
} from "../hooks/useQueries";
import { idbSaveScript } from "../utils/idb";

interface Props {
  activeDocId: string | null;
  onDocumentDeleted: () => void;
  allDocs: DocumentMeta[];
  isInitialized: boolean;
  menuTrigger: number;
}

let lastMenuTrigger = 0;

export default function CreateScreen({
  activeDocId,
  onDocumentDeleted,
  allDocs,
  menuTrigger,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [liveContent, setLiveContent] = useState("");
  const [liveTitle, setLiveTitle] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveContentRef = useRef(liveContent);
  const liveTitleRef = useRef(liveTitle);
  const initializedDocRef = useRef<string | null>(null);

  const { data: doc, isLoading } = useGetDocument(activeDocId);
  const updateDoc = useUpdateDocument();
  const deleteDoc = useDeleteDocument();

  // Track latest values in refs to avoid stale closures
  liveContentRef.current = liveContent;
  liveTitleRef.current = liveTitle;

  // Sync local state when a new doc loads (not on re-renders)
  if (doc && doc.id !== initializedDocRef.current) {
    initializedDocRef.current = doc.id;
    // Use a direct assignment pattern (not useEffect) to avoid stale closure issues
    // These will take effect in the render after this
  }

  // Derive initial content/title from doc when it changes
  // Track via a "lastSyncedDocId" ref to sync once on doc load
  const lastSyncedDocIdRef = useRef<string | null>(null);
  if (doc && doc.id !== lastSyncedDocIdRef.current) {
    lastSyncedDocIdRef.current = doc.id;
    // Sync happens as side-effect after render — but we need it NOW:
    // Trigger an update in the next tick
    Promise.resolve().then(() => {
      setLiveTitle(doc.title);
      setLiveContent(doc.content);
      setIsSaved(true);
    });
  }

  // Open menu when trigger fires (compare to last seen value)
  if (menuTrigger > lastMenuTrigger && activeDocId) {
    lastMenuTrigger = menuTrigger;
    Promise.resolve().then(() => setShowMenu(true));
  }

  async function doSave(content: string, title: string) {
    if (!activeDocId) return;
    const useTitle = title.trim() || "Untitled Script";
    try {
      await Promise.all([
        updateDoc.mutateAsync({ id: activeDocId, title: useTitle, content }),
        idbSaveScript(activeDocId, useTitle, content),
      ]);
      setIsSaved(true);
    } catch {
      // IDB still saves offline
    }
  }

  function scheduleSave(content: string, title: string, delay = 30000) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(content, title), delay);
  }

  function handleContentChange(content: string) {
    setLiveContent(content);
    setIsSaved(false);
    scheduleSave(content, liveTitleRef.current);
  }

  function handleTitleChange(title: string) {
    setLiveTitle(title);
    setIsSaved(false);
    scheduleSave(liveContentRef.current, title, 2000);
  }

  function handleManualSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    doSave(liveContentRef.current, liveTitleRef.current);
  }

  function handleExportTxt() {
    const blob = new Blob([liveContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${liveTitle || "untitled"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  }

  function handleImport() {
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.fountain";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          setLiveContent(text);
          setIsSaved(false);
          scheduleSave(text, liveTitleRef.current, 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setShowMenu(false);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: liveTitle, text: liveContent }).catch(() => {});
    } else {
      navigator.clipboard.writeText(liveContent).catch(() => {});
    }
    setShowMenu(false);
  }

  async function handleDelete() {
    if (!activeDocId) return;
    await deleteDoc.mutateAsync(activeDocId);
    setShowDeleteConfirm(false);
    setShowMenu(false);
    onDocumentDeleted();
  }

  if (!activeDocId) {
    return (
      <div className="create-screen">
        <div className="editor-no-doc" data-ocid="create.empty_state">
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(29,185,84,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={28} style={{ color: "var(--accent-color)" }} />
          </div>
          <p>Tap the + button below to start a new script</p>
        </div>
      </div>
    );
  }

  if (isLoading || !doc) {
    return (
      <div className="create-screen">
        <div className="editor-loading" data-ocid="create.loading_state">
          Loading script...
        </div>
      </div>
    );
  }

  const currentMeta = allDocs.find((d) => d.id === activeDocId) ?? null;

  return (
    <div className="create-screen" data-ocid="create.section">
      <div
        className={`save-dot${isSaved ? " saved" : ""}`}
        title={isSaved ? "Saved" : "Unsaved changes"}
        data-ocid="create.save.success_state"
      />

      <ScreenplayEditor
        document={doc as Document}
        onContentChange={handleContentChange}
        onTitleChange={handleTitleChange}
        onSaveNow={handleManualSave}
        isSaved={isSaved}
        docTitle={liveTitle || doc.title}
        docMeta={currentMeta}
      />

      {showMenu && (
        <MenuOverlay
          onClose={() => setShowMenu(false)}
          onExport={handleExportTxt}
          onImport={handleImport}
          onShare={handleShare}
          onDelete={() => {
            setShowMenu(false);
            setShowDeleteConfirm(true);
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          title={liveTitle || "Untitled Script"}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
