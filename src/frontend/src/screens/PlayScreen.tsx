import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DocumentMeta } from "../backend.d";
import { useGetDocument } from "../hooks/useQueries";

interface Props {
  activeDoc: DocumentMeta | null;
}

type LineType =
  | "slugline"
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical";

interface ScriptLine {
  type: LineType;
  text: string;
}

function parseContent(content: string): ScriptLine[] {
  const lines = content.split("\n");
  const result: ScriptLine[] = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) continue;
    const trimmed = line.trim();
    if (trimmed.startsWith("[slugline]")) {
      result.push({
        type: "slugline",
        text: trimmed.replace("[slugline]", "").trim(),
      });
    } else if (trimmed.startsWith("[character]")) {
      result.push({
        type: "character",
        text: trimmed.replace("[character]", "").trim(),
      });
    } else if (trimmed.startsWith("[dialogue]")) {
      result.push({
        type: "dialogue",
        text: trimmed.replace("[dialogue]", "").trim(),
      });
    } else if (trimmed.startsWith("[parenthetical]")) {
      result.push({
        type: "parenthetical",
        text: trimmed.replace("[parenthetical]", "").trim(),
      });
    } else {
      result.push({ type: "action", text: line });
    }
  }
  return result;
}

export default function PlayScreen({ activeDoc }: Props) {
  const { data: fullDoc, isLoading } = useGetDocument(activeDoc?.id ?? null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const readerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    function scroll() {
      const el = readerRef.current;
      if (!el) return;
      el.scrollTop += speed * 0.4;
      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        setIsPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(scroll);
    }
    rafRef.current = requestAnimationFrame(scroll);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed]);

  function handleReset() {
    setIsPlaying(false);
    if (readerRef.current) readerRef.current.scrollTop = 0;
  }

  if (!activeDoc) {
    return (
      <div className="play-screen">
        <div className="play-empty" data-ocid="play.empty_state">
          <Play
            size={40}
            style={{ color: "var(--accent-color)", opacity: 0.4 }}
          />
          <p style={{ color: "var(--muted)", fontSize: 15 }}>
            Open a script from the Library or Create tab, then come back here to
            read it.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="play-screen">
        <div className="play-empty" data-ocid="play.loading_state">
          <p style={{ color: "var(--muted)" }}>Loading script...</p>
        </div>
      </div>
    );
  }

  const lines = parseContent(fullDoc?.content ?? "");

  return (
    <div className="play-screen" data-ocid="play.section">
      {/* Controls */}
      <div className="play-controls" data-ocid="play.panel">
        <button
          type="button"
          className="play-btn"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause" : "Play"}
          data-ocid="play.toggle.button"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
          aria-label="Reset"
          data-ocid="play.reset.button"
        >
          <RotateCcw size={16} />
        </button>

        <div className="control-group">
          <span className="control-label">Speed: {speed}x</span>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="speed-slider"
            data-ocid="play.speed.input"
          />
        </div>

        <div className="font-size-controls">
          <button
            type="button"
            className="font-btn"
            onClick={() => setFontSize((s) => Math.max(12, s - 2))}
            aria-label="Decrease font size"
            data-ocid="play.fontsize_down.button"
          >
            A-
          </button>
          <button
            type="button"
            className="font-btn"
            onClick={() => setFontSize((s) => Math.min(28, s + 2))}
            aria-label="Increase font size"
            data-ocid="play.fontsize_up.button"
          >
            A+
          </button>
        </div>
      </div>

      {/* Fade overlays */}
      <div className="play-fade-top" />
      <div className="play-fade-bottom" />

      {/* Script reader */}
      <div
        ref={readerRef}
        className={`play-reader${isPlaying ? " is-playing" : ""}`}
        style={{ fontSize }}
        data-ocid="play.editor"
      >
        <div
          style={{
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontSize: fontSize + 4,
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            {fullDoc?.title ?? activeDoc.title}
          </p>
          <p style={{ fontSize: fontSize - 2, color: "var(--muted)" }}>
            {activeDoc.formatType}
          </p>
        </div>

        {lines.length === 0 && (
          <p
            style={{ color: "var(--muted)", fontSize: 14, fontStyle: "italic" }}
          >
            This script is empty.
          </p>
        )}

        {lines.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static render list
          <div key={i} className={`play-line ${line.type}`}>
            {line.text}
          </div>
        ))}

        <div style={{ height: 120 }} />
      </div>
    </div>
  );
}
