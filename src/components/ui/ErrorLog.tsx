"use client";

import { useEffect, useRef, useState } from "react";

const LOG_LINES = [
  { time: "03:12:41", text: "retry 4/5... model timeout (flux-dev)", type: "normal" },
  { time: "03:12:44", text: "fallback not configured. exiting.", type: "normal" },
  { time: "03:12:44", text: "ERROR: pipeline failed at step 3", type: "error" },
  { time: "03:12:45", text: "restart? check glue.py line 247", type: "normal" },
  { time: "03:13:01", text: "WARN: comfy node upscale_v2 not found", type: "warn" },
  { time: "03:13:01", text: "did you mean upscale_v2_fixed_final?", type: "normal" },
  { time: "03:13:15", text: "cost so far: $4.82 (expected: $0.60)", type: "normal" },
  { time: "03:13:15", text: "no rollback available", type: "normal" },
  { time: "03:13:16", text: "\u00AF\\\\_( \u30C4)_/\u00AF", type: "normal" },
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
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= LOG_LINES.length) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [visibleLines]);

  const getColor = (type: string) => {
    switch (type) {
      case "error": return "var(--interference-orange)";
      case "warn": return "var(--signal-cyan-60)";
      default: return "var(--phosphor-dim)";
    }
  };

  return (
    <div
      ref={containerRef}
      className="font-mono overflow-hidden"
      style={{ fontSize: "var(--text-system-sm)", height: "280px" }}
    >
      {LOG_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span style={{ color: "var(--signal-ghost)" }}>[{line.time}]</span>
          <span style={{ color: getColor(line.type) }}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}
