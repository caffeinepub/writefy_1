import { useEffect, useRef, useState } from "react";
import type { Document, DocumentMeta } from "../backend.d";
import { useGetDocument } from "../hooks/useQueries";

interface PlayScreenProps {
  activeDoc: DocumentMeta | null;
}

type LineType =
  | "slugline"
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical"
  | "transition";

interface ParsedLine {
  type: LineType;
  text: string;
}

function parseScript(content: string): ParsedLine[] {
  if (!content.trim()) return [];
  const rawLines = content.split("\n");
  return rawLines
    .filter((l) => l.trim().length > 0)
    .map((text) => {
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
        /^[A-Z][A-Z\s]+$/.test(trimmed)
      ) {
        type = "character";
      }
      return { type, text: trimmed };
    });
}

function PlayReader({ doc }: { doc: Document }) {
  const lines = parseScript(doc.content);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const speedRef = useRef(speed);

  // Keep speedRef in sync
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const scroll = () => {
    if (!containerRef.current) return;
    posRef.current += speedRef.current * 0.5;
    containerRef.current.scrollTop = posRef.current;
    if (
      posRef.current <
      containerRef.current.scrollHeight - containerRef.current.clientHeight
    ) {
      rafRef.current = requestAnimationFrame(scroll);
    } else {
      setIsPlaying(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll is stable ref-based
  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(scroll);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    posRef.current = 0;
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  if (lines.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "40px 24px",
          textAlign: "center",
          color: "#8A8A8A",
          minHeight: "60vh",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎬</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 8,
          }}
        >
          Script is empty
        </div>
        <div style={{ fontSize: 13, color: "#8A8A8A" }}>
          Write something in the Create tab first.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls bar */}
      <div
        style={{
          padding: "12px 16px",
          background: "rgba(0,0,0,0.85)",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Play/Pause */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#1DB954",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
          data-ocid="play.play_pause.button"
        >
          {isPlaying ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#000"
              aria-hidden="true"
            >
              <title>Pause</title>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#000"
              aria-hidden="true"
            >
              <title>Play</title>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#1a1a1a",
            border: "1px solid #333",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#8A8A8A",
          }}
          aria-label="Reset to top"
          data-ocid="play.reset.button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <title>Reset</title>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.84" />
          </svg>
        </button>

        {/* Speed */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span
            style={{ fontSize: 11, color: "#8A8A8A", whiteSpace: "nowrap" }}
          >
            Speed
          </span>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{
              flex: 1,
              accentColor: "#1DB954",
              height: 4,
              cursor: "pointer",
            }}
            data-ocid="play.speed.slider"
          />
          <span style={{ fontSize: 11, color: "#8A8A8A", minWidth: 20 }}>
            {speed}x
          </span>
        </div>

        {/* Font size */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(12, s - 2))}
            style={{
              width: 28,
              height: 28,
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
            }}
            aria-label="Decrease font size"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(28, s + 2))}
            style={{
              width: 28,
              height: 28,
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Increase font size"
          >
            A
          </button>
        </div>
      </div>

      {/* Script reading area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: isPlaying ? "hidden" : "auto",
          padding: "32px 16px 80px",
          background: "#000",
          scrollBehavior: "auto",
        }}
        data-ocid="play.reader.area"
      >
        {/* Gradient fade at top */}
        <div
          aria-hidden="true"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            background: "linear-gradient(to bottom, #000, transparent)",
            pointerEvents: "none",
            marginBottom: -48,
            zIndex: 2,
          }}
        />

        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          {lines.map((line, i) => {
            const key = `${i}-${line.text.slice(0, 8)}`;
            if (line.type === "slugline") {
              return (
                <div
                  key={key}
                  style={{
                    fontSize: fontSize,
                    fontWeight: 800,
                    color: "#4CAF50",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: i === 0 ? 0 : 32,
                    marginBottom: 12,
                    lineHeight: 1.5,
                    borderLeft: "3px solid #1DB954",
                    paddingLeft: 12,
                  }}
                >
                  {line.text}
                </div>
              );
            }
            if (line.type === "character") {
              return (
                <div
                  key={key}
                  style={{
                    fontSize: fontSize - 1,
                    fontWeight: 700,
                    color: "var(--accent-color, #1DB954)",
                    textTransform: "uppercase",
                    textAlign: "center",
                    marginTop: 24,
                    marginBottom: 4,
                    lineHeight: 1.5,
                    letterSpacing: "0.04em",
                  }}
                >
                  {line.text}
                </div>
              );
            }
            if (line.type === "dialogue") {
              return (
                <div
                  key={key}
                  style={{
                    fontSize: fontSize,
                    color: "#ffffff",
                    maxWidth: "70%",
                    margin: "4px auto 8px",
                    textAlign: "left",
                    lineHeight: 1.7,
                  }}
                >
                  {line.text}
                </div>
              );
            }
            if (line.type === "parenthetical") {
              return (
                <div
                  key={key}
                  style={{
                    fontSize: fontSize - 2,
                    color: "rgba(255,255,255,0.6)",
                    fontStyle: "italic",
                    textAlign: "center",
                    maxWidth: "50%",
                    margin: "0 auto 4px",
                    lineHeight: 1.5,
                  }}
                >
                  {line.text}
                </div>
              );
            }
            return (
              <div
                key={key}
                style={{
                  fontSize: fontSize,
                  color: "#cccccc",
                  marginBottom: 10,
                  lineHeight: 1.7,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Gradient fade at bottom */}
        <div
          aria-hidden="true"
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to top, #000, transparent)",
            pointerEvents: "none",
            marginTop: -80,
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

export default function PlayScreen({ activeDoc }: PlayScreenProps) {
  const { data: fullDoc } = useGetDocument(activeDoc?.id ?? null);

  if (!activeDoc) {
    return (
      <div
        style={{
          background: "transparent",
          minHeight: "100%",
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
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            border: "2px solid #1DB954",
          }}
        >
          <svg
            width="28"
            height="28"
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
          No Script Open
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            lineHeight: 1.6,
            maxWidth: 260,
          }}
        >
          Open a screenplay from the Library or create one in the Create tab.
        </div>
      </div>
    );
  }

  if (!fullDoc) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "#8A8A8A",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid #1A1A1A",
            borderTopColor: "#1DB954",
          }}
        />
        <div style={{ fontSize: 13 }}>Loading script...</div>
      </div>
    );
  }

  return <PlayReader doc={fullDoc} />;
}
