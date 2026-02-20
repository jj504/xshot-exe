"use client";

import { useEffect, useState } from "react";

interface PipelineStatusProps {
  active?: boolean;
}

const STATUS_LINES = [
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

export default function PipelineStatus({ active = false }: PipelineStatusProps) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!active) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= STATUS_LINES.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="font-mono space-y-0" style={{ fontSize: "var(--text-system-sm)" }}>
      {STATUS_LINES.slice(0, visibleLines).map((line, i) => {
        if (!line.label && !line.value) {
          return <div key={i} className="h-4" />;
        }
        return (
          <div key={i} className="flex gap-3 leading-relaxed">
            <span
              className="shrink-0"
              style={{
                color: "var(--phosphor-dim)",
                width: "80px",
                display: "inline-block",
              }}
            >
              {line.label}
            </span>
            <span style={{ color: "var(--signal-cyan-100)" }}>{line.value}</span>
          </div>
        );
      })}
    </div>
  );
}
