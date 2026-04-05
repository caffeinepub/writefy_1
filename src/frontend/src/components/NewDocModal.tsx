import { BookOpen, Film, X } from "lucide-react";
import { useCreateDocument } from "../hooks/useQueries";
import { generateUUID } from "../utils/formatTime";

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function NewDocModal({ onSelect, onClose }: Props) {
  const createDoc = useCreateDocument();

  async function handleSelect(formatType: "Novel" | "Screenplay") {
    const id = generateUUID();
    const title = "Untitled Script";
    const defaultContent = `[slugline] INT. ABANDONED WAREHOUSE - NIGHT
Moonlight seeps through cracked windows.
[character] HERO
[parenthetical] (quietly)
[dialogue] Every story begins with a single word.`;
    await createDoc.mutateAsync({
      id,
      title,
      content: defaultContent,
      formatType,
    });
    onSelect(id);
  }

  return (
    <div className="modal-overlay" data-ocid="newdoc.modal">
      <p className="modal-title">What are you writing?</p>

      <div className="modal-cards">
        <button
          type="button"
          className="doc-type-card"
          onClick={() => handleSelect("Novel")}
          disabled={createDoc.isPending}
          data-ocid="newdoc.novel.button"
        >
          <div className="doc-type-icon">
            <BookOpen size={28} />
          </div>
          <p className="doc-type-name">Novel</p>
          <p className="doc-type-desc">Long-form prose and storytelling</p>
        </button>

        <button
          type="button"
          className="doc-type-card"
          onClick={() => handleSelect("Screenplay")}
          disabled={createDoc.isPending}
          data-ocid="newdoc.screenplay.button"
        >
          <div className="doc-type-icon">
            <Film size={28} />
          </div>
          <p className="doc-type-name">Screenplay</p>
          <p className="doc-type-desc">Film scripts and screenwriting</p>
        </button>
      </div>

      {createDoc.isPending && (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Creating...</p>
      )}

      <button
        type="button"
        className="modal-close-btn"
        onClick={onClose}
        aria-label="Close"
        data-ocid="newdoc.close.button"
      >
        <X size={20} />
      </button>
    </div>
  );
}
