import { BookOpen, Film, Plus } from "lucide-react";
import type { DocumentMeta } from "../backend.d";
import { formatRelativeTime } from "../utils/formatTime";

interface Props {
  mostRecentDoc: DocumentMeta | null;
  onResumeDoc: (id: string) => void;
  onNewDoc: () => void;
}

export default function HomeScreen({
  mostRecentDoc,
  onResumeDoc,
  onNewDoc,
}: Props) {
  return (
    <div className="home-screen" data-ocid="home.section">
      {mostRecentDoc ? (
        <>
          <p className="section-label">Continue Writing</p>
          <div className="resume-card" data-ocid="home.resume.card">
            <div className="resume-card-top">
              <div>
                <span className="resume-card-type">
                  {mostRecentDoc.formatType === "Novel"
                    ? "Novel"
                    : "Screenplay"}
                </span>
                <div className="resume-card-title">{mostRecentDoc.title}</div>
                <div className="resume-card-meta">
                  Last edited {formatRelativeTime(mostRecentDoc.lastEdited)}
                </div>
              </div>
              <div style={{ color: "rgba(29,185,84,0.6)", marginTop: 4 }}>
                {mostRecentDoc.formatType === "Novel" ? (
                  <BookOpen size={24} />
                ) : (
                  <Film size={24} />
                )}
              </div>
            </div>
            <div className="resume-card-footer">
              <button
                type="button"
                className="resume-btn"
                data-ocid="home.resume.primary_button"
                onClick={() => onResumeDoc(mostRecentDoc.id)}
              >
                Resume Writing
              </button>
            </div>
          </div>

          <button
            type="button"
            className="start-new-btn"
            data-ocid="home.new.button"
            onClick={onNewDoc}
          >
            <Plus size={16} />
            Start something new
          </button>
        </>
      ) : (
        <div className="empty-state" data-ocid="home.empty_state">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(29,185,84,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Film size={32} style={{ color: "var(--accent-color)" }} />
          </div>
          <h2>Welcome to Writefy</h2>
          <p>
            Your cinematic writing workspace. Start a screenplay or novel and
            let the words flow.
          </p>
          <button
            type="button"
            className="primary-btn"
            data-ocid="home.start.primary_button"
            onClick={onNewDoc}
          >
            <Plus size={18} />
            Start Writing
          </button>
        </div>
      )}
    </div>
  );
}
