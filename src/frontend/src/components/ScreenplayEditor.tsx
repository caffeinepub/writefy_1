import { useCallback, useEffect, useRef, useState } from "react";
import type { Document } from "../backend.d";

type LineType =
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical"
  | "slugline";
type FormatMode =
  | "Slugline"
  | "Action"
  | "Character"
  | "Dialogue"
  | "Parenthetical";

interface ScriptLine {
  id: number;
  type: LineType;
  text: string;
}

interface ScreenplayEditorProps {
  document: Document | null;
  onContentChange: (content: string) => void;
  isSaved: boolean;
}

const FORMAT_MODES: FormatMode[] = [
  "Slugline",
  "Action",
  "Character",
  "Dialogue",
  "Parenthetical",
];

const FORMAT_MAP: Record<FormatMode, LineType> = {
  Slugline: "slugline",
  Action: "action",
  Character: "character",
  Dialogue: "dialogue",
  Parenthetical: "parenthetical",
};

const LINE_TYPE_MAP: Record<LineType, FormatMode> = {
  slugline: "Slugline",
  action: "Action",
  character: "Character",
  dialogue: "Dialogue",
  parenthetical: "Parenthetical",
};

const DEFAULT_LINES: ScriptLine[] = [
  { id: 1, type: "slugline", text: "INT. ABANDONED WAREHOUSE - NIGHT" },
  {
    id: 2,
    type: "action",
    text: "Moonlight seeps through cracked windows. Dust dances in the air. Two figures face each other in silence.",
  },
  { id: 3, type: "character", text: "RAMA" },
  { id: 4, type: "parenthetical", text: "(quietly)" },
  {
    id: 5,
    type: "dialogue",
    text: "I've been waiting for this moment my entire life.",
  },
  { id: 6, type: "character", text: "SARAH" },
  { id: 7, type: "dialogue", text: "Then let's not waste another second." },
  { id: 8, type: "action", text: "" },
];

function parseContentToLines(content: string): ScriptLine[] {
  if (!content.trim()) return DEFAULT_LINES;
  const rawLines = content.split("\n");
  let nextId = 1;
  return rawLines.map((text) => {
    const trimmed = text.trim();
    let type: LineType = "action";
    if (
      trimmed.startsWith("INT.") ||
      trimmed.startsWith("EXT.") ||
      trimmed.startsWith("INT/EXT")
    ) {
      type = "slugline";
    } else if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
      type = "parenthetical";
    } else if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 0 &&
      /^[A-Z\s]+$/.test(trimmed)
    ) {
      type = "character";
    }
    return { id: nextId++, type, text };
  });
}

function linesToContent(lines: ScriptLine[]): string {
  return lines.map((l) => l.text).join("\n");
}

function detectNextLineType(currentType: LineType): LineType {
  if (currentType === "character") return "dialogue";
  if (currentType === "parenthetical") return "dialogue";
  if (currentType === "slugline") return "action";
  return "action";
}

export default function ScreenplayEditor({
  document,
  onContentChange,
  isSaved: _isSaved,
}: ScreenplayEditorProps) {
  const [activeTab, setActiveTab] = useState<"Write" | "Outline">("Write");
  const [formatMode, setFormatMode] = useState<FormatMode>("Action");
  const [lines, setLines] = useState<ScriptLine[]>(() => {
    if (document?.content) return parseContentToLines(document.content);
    return DEFAULT_LINES;
  });
  const [activeLineId, setActiveLineId] = useState<number>(lines[0]?.id ?? 1);
  const nextId = useRef(Math.max(...lines.map((l) => l.id)) + 1);
  const lineRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reload when doc id changes
  useEffect(() => {
    if (document?.content) {
      const parsed = parseContentToLines(document.content);
      setLines(parsed);
      nextId.current = Math.max(...parsed.map((l) => l.id)) + 1;
    }
  }, [document?.id]);

  useEffect(() => {
    const activeLine = lines.find((l) => l.id === activeLineId);
    if (activeLine) {
      setFormatMode(LINE_TYPE_MAP[activeLine.type]);
    }
  }, [activeLineId, lines]);

  const emitChange = useCallback(
    (updatedLines: ScriptLine[]) => {
      onContentChange(linesToContent(updatedLines));
    },
    [onContentChange],
  );

  const handleLineChange = useCallback(
    (id: number, text: string) => {
      setLines((prev) => {
        const updated = prev.map((l) => (l.id === id ? { ...l, text } : l));
        emitChange(updated);
        return updated;
      });
    },
    [emitChange],
  );

  const handleFormatModeChange = useCallback(
    (mode: FormatMode) => {
      setFormatMode(mode);
      setLines((prev) => {
        const updated = prev.map((l) =>
          l.id === activeLineId ? { ...l, type: FORMAT_MAP[mode] } : l,
        );
        emitChange(updated);
        return updated;
      });
    },
    [activeLineId, emitChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>, lineId: number) => {
      const lineIndex = lines.findIndex((l) => l.id === lineId);
      if (e.key === "Enter") {
        e.preventDefault();
        const currentLine = lines[lineIndex];
        const nextType = detectNextLineType(currentLine.type);
        const newId = nextId.current++;
        const newLine: ScriptLine = { id: newId, type: nextType, text: "" };
        setLines((prev) => {
          const updated = [
            ...prev.slice(0, lineIndex + 1),
            newLine,
            ...prev.slice(lineIndex + 1),
          ];
          emitChange(updated);
          return updated;
        });
        setActiveLineId(newId);
        setTimeout(() => {
          lineRefs.current.get(newId)?.focus();
        }, 0);
      } else if (
        e.key === "Backspace" &&
        lines[lineIndex].text === "" &&
        lines.length > 1
      ) {
        e.preventDefault();
        const prevLine = lines[lineIndex - 1];
        setLines((prev) => {
          const updated = prev.filter((l) => l.id !== lineId);
          emitChange(updated);
          return updated;
        });
        if (prevLine) {
          setActiveLineId(prevLine.id);
          setTimeout(() => {
            const el = lineRefs.current.get(prevLine.id);
            if (el) {
              el.focus();
              el.setSelectionRange(el.value.length, el.value.length);
            }
          }, 0);
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const modes = FORMAT_MODES;
        const currentIndex = modes.indexOf(formatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        handleFormatModeChange(nextMode);
      } else if (e.key === "ArrowUp" && lineIndex > 0) {
        e.preventDefault();
        const prevLine = lines[lineIndex - 1];
        setActiveLineId(prevLine.id);
        lineRefs.current.get(prevLine.id)?.focus();
      } else if (e.key === "ArrowDown" && lineIndex < lines.length - 1) {
        e.preventDefault();
        const nextLine = lines[lineIndex + 1];
        setActiveLineId(nextLine.id);
        lineRefs.current.get(nextLine.id)?.focus();
      }
    },
    [lines, formatMode, handleFormatModeChange, emitChange],
  );

  const getLineHeight = (text: string) => {
    const chars = text.length;
    if (chars < 40) return 1;
    return Math.ceil(chars / 40);
  };

  const sluglineCount = lines.filter((l) => l.type === "slugline").length;

  const handleOutlineItemClick = (lineId: number) => {
    setActiveTab("Write");
    setActiveLineId(lineId);
    setTimeout(() => lineRefs.current.get(lineId)?.focus(), 100);
  };

  return (
    <div style={{ background: "#000", minHeight: "100%" }}>
      {/* Editor Tabs */}
      <div className="editor-tabs">
        <button
          type="button"
          className={`editor-tab${activeTab === "Write" ? " active" : ""}`}
          onClick={() => setActiveTab("Write")}
          data-ocid="editor.write.tab"
        >
          Write
        </button>
        <button
          type="button"
          className={`editor-tab${activeTab === "Outline" ? " active" : ""}`}
          onClick={() => setActiveTab("Outline")}
          data-ocid="editor.outline.tab"
        >
          Outline
        </button>
      </div>

      {activeTab === "Write" && (
        <>
          {/* Format chips */}
          <div className="format-chips" data-ocid="editor.format.panel">
            {FORMAT_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`format-chip${formatMode === mode ? " active" : ""}`}
                onClick={() => handleFormatModeChange(mode)}
                data-ocid={`editor.format.${mode.toLowerCase()}.toggle`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Screenplay editor */}
          <div className="screenplay-editor" data-ocid="editor.canvas_target">
            {/* Line numbers */}
            <div className="line-numbers" aria-hidden="true">
              {lines.map((line, idx) => (
                <div
                  key={line.id}
                  style={{
                    lineHeight: "1.6",
                    height: `${getLineHeight(line.text) * 1.6}em`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    paddingTop: "2px",
                    color: line.id === activeLineId ? "#1DB954" : "#6F6F6F",
                  }}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Text area */}
            <div style={{ flex: 1, paddingRight: "16px" }}>
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={`editor-line ${line.type}${line.id === activeLineId ? " active-line" : ""}`}
                  data-ocid={
                    line.id === activeLineId ? "editor.active.row" : undefined
                  }
                >
                  <textarea
                    ref={(el) => {
                      if (el) lineRefs.current.set(line.id, el);
                      else lineRefs.current.delete(line.id);
                    }}
                    value={line.text}
                    onChange={(e) => handleLineChange(line.id, e.target.value)}
                    onFocus={() => setActiveLineId(line.id)}
                    onKeyDown={(e) => handleKeyDown(e, line.id)}
                    rows={getLineHeight(line.text)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      resize: "none",
                      fontFamily:
                        "'JetBrains Mono', 'Courier New', Courier, monospace",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#ffffff",
                      caretColor: "#1DB954",
                      padding: 0,
                      overflow: "hidden",
                      textAlign: line.type === "character" ? "center" : "left",
                      fontWeight:
                        line.type === "character" || line.type === "slugline"
                          ? 700
                          : 400,
                      textTransform:
                        line.type === "character" ? "uppercase" : "none",
                      fontStyle:
                        line.type === "parenthetical" ? "italic" : "normal",
                      paddingLeft:
                        line.type === "character"
                          ? "0"
                          : line.type === "dialogue"
                            ? "10%"
                            : line.type === "parenthetical"
                              ? "15%"
                              : "0",
                      paddingRight:
                        line.type === "character"
                          ? "0"
                          : line.type === "dialogue"
                            ? "10%"
                            : line.type === "parenthetical"
                              ? "15%"
                              : "0",
                    }}
                    placeholder={
                      line.type === "character"
                        ? "CHARACTER NAME"
                        : line.type === "slugline"
                          ? "INT. LOCATION - TIME"
                          : line.type === "parenthetical"
                            ? "(direction)"
                            : line.type === "dialogue"
                              ? "Dialogue..."
                              : "Action..."
                    }
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize={
                      line.type === "character" || line.type === "slugline"
                        ? "characters"
                        : "sentences"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "Outline" && (
        <div style={{ padding: "8px 0" }}>
          {sluglineCount === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#8A8A8A",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎬</div>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>
                No scenes yet
              </div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>
                Add sluglines (INT./EXT.) to create scenes in your outline.
              </div>
            </div>
          ) : (
            lines
              .filter((l) => l.type === "slugline" || l.type === "character")
              .map((line, idx) => (
                <button
                  key={line.id}
                  type="button"
                  className="outline-item"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                  }}
                  onClick={() => handleOutlineItemClick(line.id)}
                  data-ocid={`outline.item.${idx + 1}`}
                >
                  <span className="outline-num">{idx + 1}</span>
                  <div>
                    <div className="outline-text">{line.text || "(empty)"}</div>
                    <div className="outline-sub">
                      {line.type === "slugline" ? "Scene" : "Character"}
                    </div>
                  </div>
                </button>
              ))
          )}
        </div>
      )}
    </div>
  );
}
