import { MoreVertical, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import type { DocumentMeta } from "./backend.d";
import NewDocModal from "./components/NewDocModal";
import SettingsOverlay from "./components/SettingsOverlay";
import { useGetAllDocumentsMeta } from "./hooks/useQueries";
import CreateScreen from "./screens/CreateScreen";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import PlayScreen from "./screens/PlayScreen";

type Tab = "Home" | "Library" | "Create" | "Play";

const THEMES: Record<string, string> = {
  green: "#1db954",
  red: "#e53935",
  blue: "#1565c0",
  purple: "#7b1fa2",
  gold: "#f9a825",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [menuTrigger, setMenuTrigger] = useState(0);

  const { data: allDocs = [], isLoading } = useGetAllDocumentsMeta();

  // Apply saved theme
  useEffect(() => {
    const saved = localStorage.getItem("writefy-theme");
    if (saved && THEMES[saved]) {
      document.documentElement.style.setProperty(
        "--accent-color",
        THEMES[saved],
      );
    }
  }, []);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }, []);

  function handleDocumentCreated(id: string) {
    setActiveDocId(id);
    setActiveTab("Create");
    setShowNewDocModal(false);
  }

  function handleDocumentDeleted() {
    setActiveDocId(null);
    setActiveTab("Library");
  }

  function handleOpenDoc(id: string) {
    setActiveDocId(id);
    setActiveTab("Create");
  }

  const mostRecentDoc: DocumentMeta | null =
    allDocs.length > 0
      ? [...allDocs].sort((a, b) => Number(b.lastEdited - a.lastEdited))[0]
      : null;

  const activeDoc: DocumentMeta | null =
    allDocs.find((d) => d.id === activeDocId) ?? null;

  function renderScreen() {
    switch (activeTab) {
      case "Home":
        return (
          <HomeScreen
            mostRecentDoc={mostRecentDoc}
            onResumeDoc={handleOpenDoc}
            onNewDoc={() => setShowNewDocModal(true)}
          />
        );
      case "Library":
        return (
          <LibraryScreen
            docs={allDocs}
            isLoading={isLoading}
            onOpenDoc={handleOpenDoc}
            onNewDoc={() => setShowNewDocModal(true)}
          />
        );
      case "Create":
        return (
          <CreateScreen
            activeDocId={activeDocId}
            onDocumentDeleted={handleDocumentDeleted}
            allDocs={allDocs}
            isInitialized={!isLoading}
            menuTrigger={menuTrigger}
          />
        );
      case "Play":
        return <PlayScreen activeDoc={activeDoc} />;
    }
  }

  function getHeaderCenter() {
    if (activeTab === "Create") {
      return <span className="header-brand">WRITEFY</span>;
    }
    return (
      <span style={{ fontSize: "16px", fontWeight: 700 }}>{activeTab}</span>
    );
  }

  return (
    <div className="writefy-app">
      {/* Header */}
      <header className="writefy-header" data-ocid="app.panel">
        <button
          type="button"
          className="header-btn"
          style={{ opacity: activeTab === "Create" ? 1 : 0.3 }}
          onClick={() => activeTab === "Create" && setMenuTrigger((n) => n + 1)}
          aria-label="Menu"
          data-ocid="app.open_modal_button"
        >
          <MoreVertical size={20} />
        </button>
        <div className="header-title">{getHeaderCenter()}</div>
        <button
          type="button"
          className="header-btn"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          data-ocid="app.settings.button"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Screen Content */}
      <main className="writefy-screen">{renderScreen()}</main>

      {/* Bottom Navigation */}
      <nav className="writefy-bottom-nav" data-ocid="app.nav.panel">
        <button
          type="button"
          className={`nav-item${activeTab === "Home" ? " active" : ""}`}
          onClick={() => setActiveTab("Home")}
          data-ocid="nav.home.link"
        >
          <HomeSvg active={activeTab === "Home"} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`nav-item${activeTab === "Library" ? " active" : ""}`}
          onClick={() => setActiveTab("Library")}
          data-ocid="nav.library.link"
        >
          <LibrarySvg active={activeTab === "Library"} />
          <span>Library</span>
        </button>

        <button
          type="button"
          className={`nav-item create-btn${activeTab === "Create" ? " active" : ""}`}
          onClick={() => setShowNewDocModal(true)}
          aria-label="Create"
          data-ocid="nav.create.button"
        >
          <CreateSvg active={activeTab === "Create"} />
          <span>Create</span>
        </button>

        <button
          type="button"
          className={`nav-item${activeTab === "Play" ? " active" : ""}`}
          onClick={() => setActiveTab("Play")}
          data-ocid="nav.play.link"
        >
          <PlaySvg active={activeTab === "Play"} />
          <span>Play</span>
        </button>
      </nav>

      {/* Modals */}
      {showNewDocModal && (
        <NewDocModal
          onSelect={handleDocumentCreated}
          onClose={() => setShowNewDocModal(false)}
        />
      )}

      {showSettings && (
        <SettingsOverlay onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

// ── SVG Nav Icons ──
function HomeSvg({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Home</title>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LibrarySvg({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Library</title>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CreateSvg({ active }: { active: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Create</title>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function PlaySvg({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Play</title>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
