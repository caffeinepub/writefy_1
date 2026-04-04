import { Toaster } from "@/components/ui/sonner";
import { BookOpen, Home, MoreVertical, Plus, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NewDocModal from "./components/NewDocModal";
import SettingsOverlay from "./components/SettingsOverlay";
import { useActor } from "./hooks/useActor";
import {
  useCreateDocument,
  useGetAllDocumentsMeta,
  useUpdateDocument,
} from "./hooks/useQueries";
import CreateScreen from "./screens/CreateScreen";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import PlayScreen from "./screens/PlayScreen";
import { formatRelativeTime, generateUUID } from "./utils/formatTime";

type TabName = "Home" | "Library" | "Create" | "Play";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [menuTrigger, setMenuTrigger] = useState(0);

  // Inline title editing state (only for Create tab)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  // Track the latest content so we can save with the right title
  const latestContentRef = useRef("");

  const { actor } = useActor();
  const { data: docs = [], isLoading: docsLoading } = useGetAllDocumentsMeta();
  const createDoc = useCreateDocument();
  const updateDoc = useUpdateDocument();

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("writefy-theme");
    if (saved) {
      document.documentElement.style.setProperty("--accent-color", saved);
    }
  }, []);

  // Initialize: set first document id if available
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when actor/loading state changes
  useEffect(() => {
    if (!actor || docsLoading) return;
    if (docs.length > 0) {
      if (!activeDocId) setActiveDocId(docs[0].id);
      setIsInitialized(true);
    } else {
      // No docs yet — don't auto-create; user will use the (+) modal
      setIsInitialized(true);
    }
  }, [actor, docsLoading, docs.length]);

  const activeDoc = docs.find((d) => d.id === activeDocId) ?? null;

  const handleNewDoc = useCallback(
    async (type: "Novel" | "Screenplay" = "Screenplay") => {
      const newId = generateUUID();
      await createDoc.mutateAsync({
        id: newId,
        title: "Untitled Script",
        content: "",
        formatType: type,
      });
      setActiveDocId(newId);
      setActiveTab("Create");
    },
    [createDoc],
  );

  const handleOpenDoc = useCallback((id: string) => {
    setActiveDocId(id);
    setActiveTab("Create");
  }, []);

  const handleDocumentDeleted = useCallback(() => {
    const remaining = docs.filter((d) => d.id !== activeDocId);
    if (remaining.length > 0) {
      setActiveDocId(remaining[0].id);
      setActiveTab("Create");
    } else {
      setActiveDocId(null);
      setActiveTab("Home");
    }
  }, [docs, activeDocId]);

  // Handle inline title save
  const saveTitleEdit = useCallback(async () => {
    setIsEditingTitle(false);
    if (!activeDocId) return;
    const newTitle = titleInput.trim() || "Untitled Script";
    try {
      await updateDoc.mutateAsync({
        id: activeDocId,
        title: newTitle,
        content: latestContentRef.current,
      });
    } catch {
      // fail silently
    }
  }, [activeDocId, titleInput, updateDoc]);

  const startTitleEdit = useCallback(() => {
    if (activeTab === "Create") {
      setTitleInput(activeDoc?.title ?? "Untitled Script");
      setIsEditingTitle(true);
    }
  }, [activeTab, activeDoc]);

  const lastEditedText = activeDoc
    ? `Screenplay \u2022 ${formatRelativeTime(activeDoc.lastEdited)}`
    : "Screenplay \u2022 New document";

  // Header center content
  const renderHeaderCenter = () => {
    if (activeTab === "Create") {
      return (
        <div className="writefy-header-center">
          <span className="writefy-brand">Writefy</span>
          {isEditingTitle ? (
            <input
              className="writefy-title-input"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={saveTitleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitleEdit();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              // biome-ignore lint/a11y/noAutofocus: intentional inline rename
              autoFocus
              data-ocid="header.title.input"
            />
          ) : (
            <button
              type="button"
              className="writefy-doc-title"
              onClick={startTitleEdit}
              style={{ cursor: "text" }}
              data-ocid="header.title.button"
            >
              {activeDoc?.title ?? "Untitled Script"}
            </button>
          )}
          <span className="writefy-doc-meta">{lastEditedText}</span>
        </div>
      );
    }
    const tabTitles: Record<TabName, string> = {
      Home: "Home",
      Library: "Library",
      Create: "Create",
      Play: "Play",
    };
    return (
      <div className="writefy-header-center">
        <span className="writefy-tab-title">{tabTitles[activeTab]}</span>
      </div>
    );
  };

  const handlePlusPress = () => {
    setShowNewDocModal(true);
  };

  const handleNewDocModalSelect = async (type: "Novel" | "Screenplay") => {
    setShowNewDocModal(false);
    await handleNewDoc(type);
  };

  return (
    <>
      <Toaster />
      <div className="writefy-app">
        {/* ── Fixed Header ── */}
        <header className="writefy-header" data-ocid="header.section">
          {/* LEFT: Three-dot menu — always visible */}
          <button
            type="button"
            className="writefy-icon-btn"
            onClick={() => {
              if (activeTab === "Create") {
                setMenuTrigger((n) => n + 1);
              }
            }}
            aria-label="Document options"
            data-ocid="header.menu.button"
            style={{ opacity: activeTab === "Create" ? 1 : 0.3 }}
          >
            <MoreVertical size={20} />
          </button>

          {/* CENTER */}
          {renderHeaderCenter()}

          {/* RIGHT: Settings */}
          <button
            type="button"
            className="writefy-icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            data-ocid="header.settings.button"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* ── Main Content ── */}
        <main className="writefy-screen">
          {activeTab === "Home" && (
            <HomeScreen
              docs={docs}
              isLoading={docsLoading}
              onOpenDoc={handleOpenDoc}
              onNewDoc={handlePlusPress}
            />
          )}
          {activeTab === "Library" && (
            <LibraryScreen
              docs={docs}
              isLoading={docsLoading}
              onOpenDoc={handleOpenDoc}
              onNewDoc={handlePlusPress}
            />
          )}
          {activeTab === "Create" && (
            <CreateScreen
              activeDocId={activeDocId}
              onDocumentDeleted={handleDocumentDeleted}
              allDocs={docs}
              isInitialized={isInitialized}
              menuTrigger={menuTrigger}
              onContentUpdate={(c) => {
                latestContentRef.current = c;
              }}
            />
          )}
          {activeTab === "Play" && <PlayScreen activeDoc={activeDoc} />}
        </main>

        {/* ── Fixed Bottom Navigation ── */}
        <nav className="writefy-bottom-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`writefy-nav-item${activeTab === "Home" ? " active" : ""}`}
            onClick={() => setActiveTab("Home")}
            data-ocid="nav.home.link"
          >
            <Home size={22} />
            <span className="writefy-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`writefy-nav-item${activeTab === "Library" ? " active" : ""}`}
            onClick={() => setActiveTab("Library")}
            data-ocid="nav.library.link"
          >
            <BookOpen size={22} />
            <span className="writefy-nav-label">Library</span>
          </button>

          {/* Create: always opens modal */}
          <button
            type="button"
            className={`writefy-nav-item${activeTab === "Create" ? " active" : ""}`}
            onClick={handlePlusPress}
            data-ocid="nav.create.link"
          >
            <div
              className={`writefy-create-icon${activeTab === "Create" ? " active" : ""}`}
            >
              <Plus size={26} />
            </div>
            <span className="writefy-nav-label">Create</span>
          </button>

          <button
            type="button"
            className={`writefy-nav-item${activeTab === "Play" ? " active" : ""}`}
            onClick={() => setActiveTab("Play")}
            data-ocid="nav.play.link"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>Play</title>
              <polygon points="5,3 19,12 5,21" />
            </svg>
            <span className="writefy-nav-label">Play</span>
          </button>
        </nav>

        {showSettings && (
          <SettingsOverlay onClose={() => setShowSettings(false)} />
        )}

        {showNewDocModal && (
          <NewDocModal
            onSelect={handleNewDocModalSelect}
            onClose={() => setShowNewDocModal(false)}
          />
        )}
      </div>

      <style>{`
        @media (min-width: 480px) {
          .writefy-header,
          .writefy-bottom-nav {
            left: 50%;
            transform: translateX(-50%);
          }
          body {
            background: #111;
          }
          .writefy-app {
            border-left: 1px solid #1A1A1A;
            border-right: 1px solid #1A1A1A;
          }
        }
      `}</style>
    </>
  );
}
