"use client";

import { useEffect, useState, useRef } from "react";
import { SCRAMBLE_CHARS } from "@/lib/timing";

interface StatusLine {
  label: string;
  value: string;
  type?: "progress" | "count" | "uptime" | "text";
}

const STATUS_LINES: StatusLine[] = [
  { label: "PIPELINE", value: "rx-0847", type: "text" },
  { label: "VERSION", value: "v2.1.3", type: "text" },
  { label: "STEPS", value: "3/3 nominal", type: "text" },
  { label: "", value: "" },
  { label: "STEP-01", value: "upscale       \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK       12ms", type: "text" },
  { label: "STEP-02", value: "style_tfr     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK      847ms", type: "text" },
  { label: "STEP-03", value: "output        \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  OK        3ms", type: "text" },
  { label: "", value: "" },
  { label: "RETRIES", value: "0 triggered", type: "text" },
  { label: "FALLBACKS", value: "0 triggered", type: "text" },
  { label: "COST", value: "$0.58 / $0.60 limit", type: "text" },
  { label: "", value: "" },
  { label: "ENDPOINT", value: "POST /v1/rx-0847", type: "text" },
  { label: "UPTIME", value: "\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0\u25A0  100%", type: "text" },
];

function useDecodeLine(target: string, active: boolean, delay: number) {
  const [display, setDisplay] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || doneRef.current || !target) return;

    const start = performance.now() + delay;
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) { animId = requestAnimationFrame(tick); return; }

      let result = "";
      let allDone = true;
      const stagger = 8;
      const cycleDur = 60;

      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { result += " "; continue; }
        const ce = elapsed - i * stagger;
        if (ce >= cycleDur) {
          result += target[i];
        } else if (ce > 0) {
          allDone = false;
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          allDone = false;
          result += " ";
        }
      }

      setDisplay(result);
      if (allDone) {
        setDisplay(target);
        doneRef.current = true;
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, target, delay]);

  return display;
}

interface PipelineStatusProps {
  active?: boolean;
}

export default function PipelineStatus({ active = false }: PipelineStatusProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [flickerIdx, setFlickerIdx] = useState(-1);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= STATUS_LINES.length) clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, [active]);

  // Ambient value flicker every 5-6s
  useEffect(() => {
    if (visibleCount < STATUS_LINES.length) return;
    const iv = setInterval(() => {
      const candidates = [4, 5, 6]; // step lines
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setFlickerIdx(pick);
      setTimeout(() => setFlickerIdx(-1), 120);
    }, 5500);
    return () => clearInterval(iv);
  }, [visibleCount]);

  return (
    <div className="font-mono" style={{ fontSize: "var(--text-system-sm)" }}>
      {STATUS_LINES.slice(0, visibleCount).map((line, i) => {
        if (!line.label && !line.value) return <div key={i} className="h-3" />;
        return (
          <StatusLineRow
            key={i}
            line={line}
            index={i}
            active={active}
            flicker={flickerIdx === i}
          />
        );
      })}
    </div>
  );
}

function StatusLineRow({ line, index, active, flicker }: {
  line: StatusLine; index: number; active: boolean; flicker: boolean;
}) {
  const decoded = useDecodeLine(line.value, active, index * 80);

  const displayValue = flicker
    ? line.value.split("").map(c => c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join("")
    : decoded;

  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="shrink-0 w-[80px]" style={{ color: "var(--phosphor-dim)" }}>
        {line.label}
      </span>
      <span style={{ color: "var(--signal-cyan-100)" }}>{displayValue}</span>
    </div>
  );
}
