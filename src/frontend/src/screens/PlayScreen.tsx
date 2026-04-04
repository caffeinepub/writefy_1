import type { DocumentMeta } from "../backend.d";

interface PlayScreenProps {
  activeDoc: DocumentMeta | null;
}

export default function PlayScreen({ activeDoc }: PlayScreenProps) {
  return (
    <div
      style={{
        background: "#000",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="page-title">Play</div>
      <div className="page-subtitle">Preview your screenplay here.</div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          textAlign: "center",
        }}
        data-ocid="play.section"
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            border: "2px solid #1DB954",
            boxShadow: "0 0 20px rgba(29, 185, 84, 0.3)",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#1DB954"
            aria-hidden="true"
          >
            <title>Play</title>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 8,
          }}
        >
          {activeDoc ? activeDoc.title : "No Script Selected"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            lineHeight: 1.6,
            maxWidth: 260,
          }}
        >
          {activeDoc
            ? "Teleprompter-style reading mode coming soon. Your screenplay will scroll here."
            : "Open a screenplay from the Library or create one in the Create tab to preview it here."}
        </div>
      </div>
    </div>
  );
}
