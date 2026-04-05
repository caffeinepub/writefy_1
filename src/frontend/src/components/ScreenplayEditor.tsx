import { useCallback, useEffect, useRef, useState } from "react";
import type { Document, DocumentMeta } from "../backend.d";

interface Props {
  document: Document;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onSaveNow: () => void;
  isSaved: boolean;
  docTitle: string;
  docMeta: DocumentMeta | null;
}

type LineType =
  | "slugline"
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical";

interface Line {
  id: string;
  type: LineType;
  text: string;
}

type EditorTab = "write" | "outline";

const FORMAT_CHIPS: { label: string; type: LineType }[] = [
  { label: "Slugline", type: "slugline" },
  { label: "Action", type: "action" },
  { label: "Character", type: "character" },
  { label: "Dialogue", type: "dialogue" },
  { label: "Parenthetical", type: "parenthetical" },
];

const SMART_NEXT: Record<LineType, LineType> = {
  slugline: "action",
  action: "action",
  character: "dialogue",
  dialogue: "action",
  parenthetical: "dialogue",
};

const TYPE_PREFIX: Record<LineType, string> = {
  slugline: "[slugline]",
  action: "",
  character: "[character]",
  dialogue: "[dialogue]",
  parenthetical: "[parenthetical]",
};

const DEFAULT_LINES: Line[] = [
  { id: "d1", type: "slugline", text: "INT. ABANDONED WAREHOUSE - NIGHT" },
  {
    id: "d2",
    type: "action",
    text: "Moonlight seeps through cracked windows.",
  },
  { id: "d3", type: "character", text: "RAMA" },
  { id: "d4", type: "parenthetical", text: "(quietly)" },
  {
    id: "d5",
    type: "dialogue",
    text: "I've been waiting for this moment my entire life.",
  },
  { id: "d6", type: "character", text: "SARAH" },
  { id: "d7", type: "dialogue", text: "Then let's not waste another second." },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function parseContent(content: string): Line[] {
  if (!content.trim()) return DEFAULT_LINES.map((l) => ({ ...l, id: uid() }));
  const lines = content.split("\n");
  const result: Line[] = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) continue;
    const trimmed = line.trim();
    if (trimmed.startsWith("[slugline]")) {
      result.push({
        id: uid(),
        type: "slugline",
        text: trimmed.replace("[slugline]", "").trim(),
      });
    } else if (trimmed.startsWith("[character]")) {
      result.push({
        id: uid(),
        type: "character",
        text: trimmed.replace("[character]", "").trim(),
      });
    } else if (trimmed.startsWith("[dialogue]")) {
      result.push({
        id: uid(),
        type: "dialogue",
        text: trimmed.replace("[dialogue]", "").trim(),
      });
    } else if (trimmed.startsWith("[parenthetical]")) {
      result.push({
        id: uid(),
        type: "parenthetical",
        text: trimmed.replace("[parenthetical]", "").trim(),
      });
    } else {
      result.push({ id: uid(), type: "action", text: line });
    }
  }
  return result.length > 0
    ? result
    : DEFAULT_LINES.map((l) => ({ ...l, id: uid() }));
}

function serializeLines(lines: Line[]): string {
  return lines
    .map((l) => {
      const prefix = TYPE_PREFIX[l.type];
      return prefix ? `${prefix} ${l.text}` : l.text;
    })
    .join("\n");
}

export default function ScreenplayEditor({
  document,
  onContentChange,
  onTitleChange,
  onSaveNow,
  docTitle,
  docMeta,
}: Props) {
  const [lines, setLines] = useState<Line[]>(() =>
    parseContent(document.content),
  );
  const [activeTab, setActiveTab] = useState<EditorTab>("write");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(docTitle);
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());
  const focusedLineIdRef = useRef<string | null>(null);
  const [focusedLineId, setFocusedLineId] = useState<string | null>(null);
  // Track docId to re-parse only when a DIFFERENT doc opens
  const lastParsedDocIdRef = useRef(document.id);

  // Sync title when prop changes
  useEffect(() => {
    setTitleValue(docTitle);
  }, [docTitle]);

  // Re-parse content only when a genuinely different doc is loaded
  // This runs once per doc switch, not on every render
  useEffect(() => {
    if (document.id !== lastParsedDocIdRef.current) {
      lastParsedDocIdRef.current = document.id;
      setLines(parseContent(document.content));
    }
  }, [document.id, document.content]);

  const resizeAll = useCallback(() => {
    for (const el of textareaRefs.current.values()) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  // Initial resize on mount only
  useEffect(() => {
    requestAnimationFrame(resizeAll);
  }, [resizeAll]);

  function updateLine(id: string, text: string) {
    setLines((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, text } : l));
      onContentChange(serializeLines(next));
      return next;
    });
    requestAnimationFrame(() => {
      const el = textareaRefs.current.get(id);
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    });
  }

  function changeLineType(id: string, type: LineType) {
    setLines((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, type } : l));
      onContentChange(serializeLines(next));
      return next;
    });
    requestAnimationFrame(resizeAll);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    id: string,
    idx: number,
  ) {
    const line = lines[idx];

    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      onSaveNow();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newLine: Line = {
        id: uid(),
        type: SMART_NEXT[line.type],
        text: "",
      };
      setLines((prev) => {
        const next = [
          ...prev.slice(0, idx + 1),
          newLine,
          ...prev.slice(idx + 1),
        ];
        onContentChange(serializeLines(next));
        return next;
      });
      requestAnimationFrame(() => {
        const el = textareaRefs.current.get(newLine.id);
        el?.focus();
      });
      return;
    }

    if (e.key === "Backspace" && line.text === "" && lines.length > 1) {
      e.preventDefault();
      const prevLine = lines[idx - 1] ?? lines[0];
      setLines((prev) => {
        const next = prev.filter((l) => l.id !== id);
        onContentChange(serializeLines(next));
        return next;
      });
      requestAnimationFrame(() => {
        const el = textareaRefs.current.get(prevLine.id);
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      });
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const types: LineType[] = [
        "slugline",
        "action",
        "character",
        "dialogue",
        "parenthetical",
      ];
      const currentIdx = types.indexOf(line.type);
      const nextType = types[(currentIdx + 1) % types.length];
      changeLineType(id, nextType);
      return;
    }

    if (e.key === "ArrowUp" && idx > 0) {
      const prevEl = textareaRefs.current.get(lines[idx - 1].id);
      prevEl?.focus();
    }
    if (e.key === "ArrowDown" && idx < lines.length - 1) {
      const nextEl = textareaRefs.current.get(lines[idx + 1].id);
      nextEl?.focus();
    }
  }

  const activeLineType = focusedLineId
    ? (lines.find((l) => l.id === focusedLineId)?.type ?? "action")
    : "action";

  const sluglines = lines.filter((l) => l.type === "slugline" && l.text.trim());

  const subtitleText = docMeta
    ? `${docMeta.formatType} \u00b7 last edited just now`
    : "Screenplay \u00b7 last edited just now";

  return (
    <div className="screenplay-editor" data-ocid="create.editor">
      {/* Background W watermark — must have pointer-events: none */}
      <div className="editor-watermark" aria-hidden="true">
        W
      </div>

      <div className="editor-header">
        <div className="editor-doc-title-wrapper">
          {editingTitle ? (
            <input
              className="editor-doc-title-input"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => {
                setEditingTitle(false);
                const t = titleValue.trim() || "Untitled Script";
                setTitleValue(t);
                onTitleChange(t);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                } else if (e.key === "Escape") {
                  setTitleValue(docTitle);
                  setEditingTitle(false);
                }
              }}
              // biome-ignore lint/a11y/noAutofocus: intentional inline title rename
              autoFocus
              data-ocid="create.title.input"
            />
          ) : (
            <button
              type="button"
              className="editor-doc-title"
              onClick={() => setEditingTitle(true)}
              title="Tap to rename"
              data-ocid="create.title.button"
            >
              {titleValue || "Untitled Script"}
            </button>
          )}
          <p className="editor-doc-subtitle">{subtitleText}</p>
        </div>

        <div className="editor-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "write"}
            className={`editor-tab${activeTab === "write" ? " active" : ""}`}
            onClick={() => setActiveTab("write")}
            data-ocid="create.write.tab"
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "outline"}
            className={`editor-tab${activeTab === "outline" ? " active" : ""}`}
            onClick={() => setActiveTab("outline")}
            data-ocid="create.outline.tab"
          >
            Outline
          </button>
        </div>
      </div>

      {activeTab === "write" && (
        <div className="format-chips" role="toolbar" aria-label="Format">
          {FORMAT_CHIPS.map((chip) => (
            <button
              key={chip.type}
              type="button"
              className={`format-chip${activeLineType === chip.type ? " active" : ""}`}
              onClick={() => {
                if (focusedLineIdRef.current) {
                  changeLineType(focusedLineIdRef.current, chip.type);
                }
              }}
              data-ocid={`create.format_${chip.type}.button`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "write" && (
        <div className="writing-slab" data-ocid="create.writing.editor">
          {lines.map((line, idx) => (
            <div key={line.id} className="slab-line" data-type={line.type}>
              <textarea
                ref={(el) => {
                  if (el) textareaRefs.current.set(line.id, el);
                  else textareaRefs.current.delete(line.id);
                }}
                className="slab-textarea"
                value={line.text}
                rows={1}
                placeholder={getPlaceholder(line.type)}
                onChange={(e) => updateLine(line.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, line.id, idx)}
                onFocus={() => {
                  focusedLineIdRef.current = line.id;
                  setFocusedLineId(line.id);
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
                spellCheck
                data-ocid={`create.line.${idx + 1}.textarea`}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "outline" && (
        <div className="outline-container" data-ocid="create.outline.panel">
          {sluglines.length === 0 ? (
            <p className="outline-empty">
              No scene headings yet. Add a Slugline in the Write tab to see your
              outline here.
            </p>
          ) : (
            sluglines.map((line, i) => (
              <div
                key={line.id}
                className="outline-item"
                data-ocid={`create.outline.item.${i + 1}`}
              >
                <p className="outline-item-title">{line.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function getPlaceholder(type: LineType): string {
  switch (type) {
    case "slugline":
      return "INT. LOCATION - TIME";
    case "action":
      return "Describe the action...";
    case "character":
      return "CHARACTER NAME";
    case "dialogue":
      return "Dialogue goes here...";
    case "parenthetical":
      return "(beat)";
  }
}
