"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/lib/useIsMobile";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

const LOG_LINES = [
  { time: "03:12:41", text: "retry 4/5... model timeout (flux-dev)", type: "normal" },
  { time: "03:12:44", text: "fallback not configured. exiting.", type: "normal" },
  { time: "03:12:44", text: "ERROR: pipeline failed at step 3", type: "error" },
  { time: "03:12:45", text: "restart? check glue.py line 247", type: "normal" },
  { time: "03:13:01", text: 'WARN: comfy node "upscale_v2" not found', type: "warn" },
  { time: "03:13:01", text: 'did you mean "upscale_v2_fixed_final"?', type: "normal" },
  { time: "03:13:15", text: "cost so far: $4.82 (expected: $0.60)", type: "normal" },
  { time: "03:13:15", text: "no rollback available", type: "normal" },
  { time: "03:13:16", text: "\u00AF\\_(\u30C4)_/\u00AF", type: "normal" },
  { time: "03:14:02", text: "restarting pipeline from step 1...", type: "normal" },
  { time: "03:14:03", text: "WARN: model weights changed since last run", type: "warn" },
  { time: "03:14:03", text: "behavior may differ from previous execution", type: "normal" },
  { time: "03:14:30", text: "step 2 returned unexpected shape (512, 512, 4)", type: "normal" },
  { time: "03:14:30", text: "expected (1024, 1024, 3)", type: "normal" },
  { time: "03:14:31", text: "pipeline aborted.", type: "error" },
  { time: "03:15:00", text: "...you are still awake for this?", type: "normal" },
];

interface ErrorLogProps {
  active?: boolean;
}

export default function ErrorLog({ active = false }: ErrorLogProps) {
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [allShown, setAllShown] = useState(false);
  const [glitchMap, setGlitchMap] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Reduced motion: show all lines immediately
  useEffect(() => {
    if (active && reducedMotion) {
      setVisibleLines(LOG_LINES.length);
      setAllShown(true);
    }
  }, [active, reducedMotion]);

  // Line-by-line reveal
  useEffect(() => {
    if (!active || reducedMotion) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= LOG_LINES.length) { clearInterval(iv); setTimeout(() => setAllShown(true), 400); }
    }, 200);
    return () => clearInterval(iv);
  }, [active, reducedMotion]);

  // Auto-scroll during reveal
  useEffect(() => {
    const el = containerRef.current;
    if (el && !allShown) el.scrollTop = el.scrollHeight;
  }, [visibleLines, allShown]);

  // Continuous scroll loop (not on reduced motion)
  useEffect(() => {
    if (!allShown || reducedMotion) return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    let y = 0;
    let animId: number;
    const scroll = () => {
      y += 0.3;
      if (y >= inner.scrollHeight / 2) y = 0;
      container.scrollTop = y;
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [allShown, reducedMotion]);

  // Character glitch (not on reduced motion)
  useEffect(() => {
    if (!allShown || reducedMotion) return;
    const iv = setInterval(() => {
      const lineIdx = Math.floor(Math.random() * LOG_LINES.length);
      const charIdx = Math.floor(Math.random() * LOG_LINES[lineIdx].text.length);
      const key = `${lineIdx}-${charIdx}`;
      setGlitchMap(prev => ({ ...prev, [key]: SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] }));
      setTimeout(() => setGlitchMap(prev => { const n = { ...prev }; delete n[key]; return n; }), 100);
    }, 800);
    return () => clearInterval(iv);
  }, [allShown, reducedMotion]);

  const getColor = useCallback((type: string) => {
    switch (type) {
      case "error": return "var(--interference-orange)";
      case "warn": return "var(--signal-cyan-60)";
      default: return "var(--phosphor-dim)";
    }
  }, []);

  const applyGlitch = useCallback((text: string, lineIdx: number) => {
    return text.split("").map((ch, ci) => glitchMap[`${lineIdx}-${ci}`] || ch).join("");
  }, [glitchMap]);

  const linesToRender = (allShown && !reducedMotion) ? [...LOG_LINES, ...LOG_LINES] : LOG_LINES.slice(0, visibleLines);

  return (
    <div
      ref={containerRef}
      className="font-mono overflow-hidden"
      style={{ fontSize: "var(--text-system-sm)", height: "280px" }}
      role="log"
      aria-label="Pipeline error log"
    >
      <div ref={innerRef}>
        {linesToRender.map((line, i) => (
          <div key={i} className="flex gap-2 leading-relaxed whitespace-nowrap">
            <span style={{ color: "var(--signal-ghost)", flexShrink: 0 }}>[{line.time}]</span>
            <span style={{ color: getColor(line.type) }}>{applyGlitch(line.text, i % LOG_LINES.length)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
