"use client";

import { useEffect, useState } from "react";

const GLYPHS = "\u2502\u2551\u2503\u250A\u254E\u2506\u00B7\u2500\u2550";

interface GlyphDividerProps {
  active?: boolean;
  vertical?: boolean;
}

export default function GlyphDivider({ active = false, vertical = true }: GlyphDividerProps) {
  const count = vertical ? 16 : 8;
  const [chars, setChars] = useState<string[]>(Array(count).fill("\u2502"));

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setChars(prev =>
        prev.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
      );
    }, 300);
    return () => clearInterval(iv);
  }, [active, count]);

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0 select-none" style={{ color: "var(--signal-ghost-light)" }}>
        {chars.slice(0, Math.floor(count / 2)).map((c, i) => (
          <span key={i} className="font-mono text-xs leading-none">{c}</span>
        ))}
        <span
          className="font-mono text-lg my-1"
          style={{
            color: "var(--signal-cyan-100)",
            animation: active ? "pulse-glow 2s ease-in-out infinite" : "none",
          }}
        >{"\u25B8"}</span>
        {chars.slice(Math.floor(count / 2)).map((c, i) => (
          <span key={i + count} className="font-mono text-xs leading-none">{c}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 justify-center select-none" style={{ color: "var(--signal-ghost-light)" }}>
      {chars.slice(0, Math.floor(count / 2)).map((c, i) => (
        <span key={i} className="font-mono text-xs">{c === "\u2502" ? "\u2500" : c}</span>
      ))}
      <span
        className="font-mono text-lg mx-2"
        style={{
          color: "var(--signal-cyan-100)",
          animation: active ? "pulse-glow 2s ease-in-out infinite" : "none",
        }}
      >{"\u25BE"}</span>
      {chars.slice(Math.floor(count / 2)).map((c, i) => (
        <span key={i + count} className="font-mono text-xs">{c === "\u2502" ? "\u2500" : c}</span>
      ))}
    </div>
  );
}
