import { Toaster } from "@/components/ui/sonner";
import { Home, Library, Menu, Plus, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SettingsOverlay from "./components/SettingsOverlay";
import { useActor } from "./hooks/useActor";
import { useCreateDocument, useGetAllDocumentsMeta } from "./hooks/useQueries";
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
  const [activeTab, setActiveTab] = useState<TabName>("Create");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [menuTrigger, setMenuTrigger] = useState(0);

  const { actor } = useActor();
  const { data: docs = [], isLoading: docsLoading } = useGetAllDocumentsMeta();
  const createDoc = useCreateDocument();

  // Initialize: create first document if none exist
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when actor/loading state changes
  useEffect(() => {
    if (!actor || docsLoading) return;
    if (docs.length > 0) {
      if (!activeDocId) setActiveDocId(docs[0].id);
      setIsInitialized(true);
    } else {
      const newId = generateUUID();
      createDoc
        .mutateAsync({
          id: newId,
          title: "Untitled Script",
          content: "",
          formatType: "Action",
        })
        .then(() => {
          setActiveDocId(newId);
          setIsInitialized(true);
        })
        .catch(() => {
          setIsInitialized(true);
        });
    }
  }, [actor, docsLoading, docs.length]);

  const activeDoc = docs.find((d) => d.id === activeDocId) ?? null;

  const handleNewDoc = useCallback(async () => {
    const newId = generateUUID();
    await createDoc.mutateAsync({
      id: newId,
      title: "Untitled Script",
      content: "",
      formatType: "Action",
    });
    setActiveDocId(newId);
    setActiveTab("Create");
  }, [createDoc]);

  const handleOpenDoc = useCallback((id: string) => {
    setActiveDocId(id);
    setActiveTab("Create");
  }, []);

  const handleDocumentDeleted = useCallback(() => {
    if (docs.length > 1) {
      const remaining = docs.filter((d) => d.id !== activeDocId);
      setActiveDocId(remaining[0]?.id ?? null);
    } else {
      setActiveDocId(null);
      handleNewDoc();
    }
  }, [docs, activeDocId, handleNewDoc]);

  const lastEditedText = activeDoc
    ? `Screenplay • Last edited ${formatRelativeTime(activeDoc.lastEdited)}`
    : "Screenplay • New document";

  return (
    <>
      <Toaster />
      <div className="writefy-app">
        {/* ── Fixed Header ── */}
        <header className="writefy-header">
          <button
            type="button"
            className="writefy-icon-btn"
            onClick={() => setMenuTrigger((n) => n + 1)}
            aria-label="Menu"
            data-ocid="header.menu.button"
          >
            <Menu />
          </button>

          <div className="writefy-header-center">
            <span className="writefy-brand">Writefy</span>
            <span className="writefy-doc-title">
              {activeDoc?.title ?? "Untitled Script"}
            </span>
            <span className="writefy-doc-meta">{lastEditedText}</span>
          </div>

          <button
            type="button"
            className="writefy-icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            data-ocid="header.settings.button"
          >
            <Settings />
          </button>
        </header>

        {/* ── Main Content ── */}
        <main className="writefy-screen">
          {activeTab === "Home" && (
            <HomeScreen
              docs={docs}
              isLoading={docsLoading}
              onOpenDoc={handleOpenDoc}
              onNewDoc={handleNewDoc}
            />
          )}
          {activeTab === "Library" && (
            <LibraryScreen
              docs={docs}
              isLoading={docsLoading}
              onOpenDoc={handleOpenDoc}
              onNewDoc={handleNewDoc}
            />
          )}
          {activeTab === "Create" && (
            <CreateScreen
              activeDocId={activeDocId}
              onDocumentDeleted={handleDocumentDeleted}
              allDocs={docs}
              isInitialized={isInitialized}
              menuTrigger={menuTrigger}
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
            <Library size={22} />
            <span className="writefy-nav-label">Library</span>
          </button>

          <button
            type="button"
            className="writefy-nav-item"
            onClick={() => setActiveTab("Create")}
            data-ocid="nav.create.link"
            style={{ position: "relative" }}
          >
            <div
              className={`writefy-create-btn${activeTab === "Create" ? " active" : ""}`}
            >
              <Plus size={24} color="#000" />
            </div>
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
