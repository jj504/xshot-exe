"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";

interface ModuleProps {
  moduleId: string;
  status?: string;
  statusColor?: string;
  statusBlink?: boolean;
  active?: boolean;
  delay?: number;
  drawDuration?: number; // ms, default 200
  borderActiveColor?: string;
  children: ReactNode;
  className?: string;
  onBooted?: () => void;
}

export default function Module({
  moduleId,
  status,
  statusColor = "var(--signal-cyan-100)",
  statusBlink = false,
  active = false,
  delay = 0,
  drawDuration = 200,
  borderActiveColor = "var(--signal-cyan-60)",
  children,
  className = "",
  onBooted,
}: ModuleProps) {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [perimeterLen, setPerimeterLen] = useState(1000);
  const onBootedRef = useRef(onBooted);
  onBootedRef.current = onBooted;

  // Measure perimeter for SVG stroke-dasharray
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setPerimeterLen(2 * (w + h));
  }, []);

  useEffect(() => {
    if (!active) return;
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), delay));
    t.push(setTimeout(() => setPhase(2), delay + drawDuration));
    t.push(setTimeout(() => setPhase(3), delay + drawDuration + 150));
    t.push(setTimeout(() => { setPhase(4); onBootedRef.current?.(); }, delay + drawDuration + 300));
    return () => t.forEach(clearTimeout);
  }, [active, delay, drawDuration]);

  const ghostColor = "var(--signal-ghost)";
  const isDrawn = phase >= 1;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        border: `1px solid ${isDrawn ? borderActiveColor : ghostColor}`,
        background: "var(--void-black)",
        transition: isDrawn ? `border-color ${drawDuration}ms linear` : "none",
      }}
    >
      {/* Animated border overlay */}
      <div
        className={`module-border-overlay ${isDrawn ? "drawing" : ""}`}
        style={{
          "--border-len": perimeterLen,
          "--draw-duration": `${drawDuration}ms`,
        } as React.CSSProperties}
      >
        <svg preserveAspectRatio="none" viewBox={`0 0 100 100`}>
          <rect
            x="0" y="0" width="100" height="100"
            vectorEffect="non-scaling-stroke"
            stroke={isDrawn ? borderActiveColor : ghostColor}
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Corner registration marks */}
      {[
        "top-[-1px] left-[-1px] border-t-2 border-l-2",
        "top-[-1px] right-[-1px] border-t-2 border-r-2",
        "bottom-[-1px] left-[-1px] border-b-2 border-l-2",
        "bottom-[-1px] right-[-1px] border-b-2 border-r-2",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 z-[2] ${pos}`}
          style={{
            borderColor: isDrawn ? borderActiveColor : ghostColor,
            transition: isDrawn ? `border-color ${drawDuration}ms linear` : "none",
          }}
        />
      ))}

      {/* Header */}
      <div
        className="relative z-[2] flex justify-between items-center px-4 py-2"
        style={{ borderBottom: `1px solid ${ghostColor}` }}
      >
        <span
          className="type-label"
          style={{
            color: borderActiveColor,
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.15s step-end",
          }}
        >
          {moduleId}
        </span>
        {status && (
          <span
            className={`type-label ${statusBlink && phase >= 3 ? "status-blink" : ""}`}
            style={{
              color: statusColor,
              opacity: phase >= 3 ? 1 : 0,
              transition: "none",
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="relative z-[2] p-4 md:p-6"
        style={{ opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.05s step-end" }}
      >
        {children}
      </div>
    </div>
  );
}
