"use client";

import { useEffect, useState, useRef } from "react";
import { SCRAMBLE_CHARS } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useIsMobile";

interface StatusLine {
  label: string;
  value: string;
}

const STATUS_LINES: StatusLine[] = [
  { label: "PIPELINE", value: "rx-0847" },
  { label: "VERSION", value: "v2.1.3" },
  { label: "STEPS", value: "3/3 nominal" },
  { label: "", value: "" },
  { label: "STEP-01", value: "upscale       \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK       12ms" },
  { label: "STEP-02", value: "style_tfr     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK      847ms" },
  { label: "STEP-03", value: "output        \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK        3ms" },
  { label: "", value: "" },
  { label: "RETRIES", value: "0 triggered" },
  { label: "FALLBACKS", value: "0 triggered" },
  { label: "COST", value: "$0.58 / $0.60 limit" },
  { label: "", value: "" },
  { label: "ENDPOINT", value: "POST /v1/rx-0847" },
  { label: "UPTIME", value: "\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0  100%" },
];

function useDecodeLine(target: string, active: boolean, delay: number, skip: boolean) {
  const [display, setDisplay] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || doneRef.current || !target) return;
    if (skip) { setDisplay(target); doneRef.current = true; return; }

    const start = performance.now() + delay;
    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) { animId = requestAnimationFrame(tick); return; }
      let result = "";
      let allDone = true;
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { result += " "; continue; }
        const ce = elapsed - i * 8;
        if (ce >= 60) { result += target[i]; }
        else if (ce > 0) { allDone = false; result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]; }
        else { allDone = false; result += " "; }
      }
      setDisplay(result);
      if (allDone) { setDisplay(target); doneRef.current = true; }
      else { animId = requestAnimationFrame(tick); }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, target, delay, skip]);

  return display;
}

export default function PipelineStatus({ active = false }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [flickerIdx, setFlickerIdx] = useState(-1);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) { setVisibleCount(STATUS_LINES.length); return; }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= STATUS_LINES.length) clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, [active, reducedMotion]);

  // Ambient flicker (skip if reduced motion)
  useEffect(() => {
    if (visibleCount < STATUS_LINES.length || reducedMotion) return;
    const iv = setInterval(() => {
      const candidates = [4, 5, 6];
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setFlickerIdx(pick);
      setTimeout(() => setFlickerIdx(-1), 120);
    }, 5500);
    return () => clearInterval(iv);
  }, [visibleCount, reducedMotion]);

  return (
    <div className="font-mono" style={{ fontSize: "var(--text-system-sm)" }} role="status" aria-label="Pipeline status readout">
      {STATUS_LINES.slice(0, visibleCount).map((line, i) => {
        if (!line.label && !line.value) return <div key={i} className="h-3" />;
        return <StatusLineRow key={i} line={line} index={i} active={active} flicker={flickerIdx === i} skipAnim={reducedMotion} />;
      })}
    </div>
  );
}

function StatusLineRow({ line, index, active, flicker, skipAnim }: {
  line: StatusLine; index: number; active: boolean; flicker: boolean; skipAnim: boolean;
}) {
  const decoded = useDecodeLine(line.value, active, index * 80, skipAnim);
  const displayValue = flicker
    ? line.value.split("").map(c => c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join("")
    : decoded;

  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="shrink-0 w-[80px]" style={{ color: "var(--phosphor-dim)" }}>{line.label}</span>
      <span style={{ color: "var(--signal-cyan-100)" }}>{displayValue}</span>
    </div>
  );
}
