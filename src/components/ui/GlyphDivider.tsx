"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useIsMobile";

const GLYPHS = "\u2502\u2551\u2503\u250A\u254E\u2506\u00B7\u2500\u2550";

interface GlyphDividerProps {
  active?: boolean;
  vertical?: boolean;
}

export default function GlyphDivider({ active = false, vertical = true }: GlyphDividerProps) {
  const reducedMotion = useReducedMotion();
  const count = vertical ? 16 : 8;
  const staticChar = vertical ? "\u2502" : "\u2500";
  const [chars, setChars] = useState<string[]>(Array(count).fill(staticChar));

  useEffect(() => {
    if (!active || reducedMotion) return;
    const iv = setInterval(() => {
      setChars(prev => prev.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
    }, 300);
    return () => clearInterval(iv);
  }, [active, count, reducedMotion, staticChar]);

  const arrowChar = vertical ? "\u25B8" : "\u25BE";
  const arrowStyle = {
    color: "var(--signal-cyan-100)",
    animation: (active && !reducedMotion) ? "pulse-glow 2s ease-in-out infinite" : "none",
  };

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0 select-none" style={{ color: "var(--signal-ghost-light)" }} aria-hidden="true">
        {chars.slice(0, Math.floor(count / 2)).map((c, i) => (
          <span key={i} className="font-mono text-xs leading-none">{c}</span>
        ))}
        <span className="font-mono text-lg my-1" style={arrowStyle}>{arrowChar}</span>
        {chars.slice(Math.floor(count / 2)).map((c, i) => (
          <span key={i + count} className="font-mono text-xs leading-none">{c}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 justify-center select-none" style={{ color: "var(--signal-ghost-light)" }} aria-hidden="true">
      {chars.slice(0, Math.floor(count / 2)).map((c, i) => (
        <span key={i} className="font-mono text-xs">{c}</span>
      ))}
      <span className="font-mono text-lg mx-2" style={arrowStyle}>{arrowChar}</span>
      {chars.slice(Math.floor(count / 2)).map((c, i) => (
        <span key={i + count} className="font-mono text-xs">{c}</span>
      ))}
    </div>
  );
}
