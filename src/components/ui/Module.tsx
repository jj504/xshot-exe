"use client";

import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/useIsMobile";

interface ModuleProps {
  moduleId: string;
  status?: string;
  statusColor?: string;
  statusBlink?: boolean;
  active?: boolean;
  delay?: number;
  drawDuration?: number;
  borderActiveColor?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
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
  style: extraStyle,
  onBooted,
}: ModuleProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [perimeterLen, setPerimeterLen] = useState(1000);
  const onBootedRef = useRef(onBooted);
  onBootedRef.current = onBooted;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setPerimeterLen(2 * (el.offsetWidth + el.offsetHeight));
  }, []);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) { setPhase(4); onBootedRef.current?.(); return; }
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), delay));
    t.push(setTimeout(() => setPhase(2), delay + drawDuration));
    t.push(setTimeout(() => setPhase(3), delay + drawDuration + 150));
    t.push(setTimeout(() => { setPhase(4); onBootedRef.current?.(); }, delay + drawDuration + 300));
    return () => t.forEach(clearTimeout);
  }, [active, delay, drawDuration, reducedMotion]);

  const ghostColor = "var(--signal-ghost)";
  const isDrawn = phase >= 1;
  const activeBorder = isDrawn ? borderActiveColor : ghostColor;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        border: `1px solid ${activeBorder}`,
        background: "var(--void-black)",
        transition: (isDrawn && !reducedMotion) ? `border-color ${drawDuration}ms linear` : "none",
        ...extraStyle,
      }}
    >
      {!reducedMotion && (
        <div className={`module-border-overlay ${isDrawn ? "drawing" : ""}`} style={{ "--border-len": perimeterLen, "--draw-duration": `${drawDuration}ms` } as React.CSSProperties} aria-hidden="true">
          <svg preserveAspectRatio="none" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" vectorEffect="non-scaling-stroke" stroke={activeBorder} strokeWidth="1" fill="none" /></svg>
        </div>
      )}

      {["top-[-1px] left-[-1px] border-t-2 border-l-2", "top-[-1px] right-[-1px] border-t-2 border-r-2", "bottom-[-1px] left-[-1px] border-b-2 border-l-2", "bottom-[-1px] right-[-1px] border-b-2 border-r-2"].map((pos, i) => (
        <div key={i} className={`absolute w-3 h-3 z-[2] ${pos}`} style={{ borderColor: activeBorder, transition: (isDrawn && !reducedMotion) ? `border-color ${drawDuration}ms linear` : "none" }} aria-hidden="true" />
      ))}

      <div className="relative z-[2] flex justify-between items-center px-4 py-2" style={{ borderBottom: `1px solid ${ghostColor}` }}>
        <span className="type-label" style={{ color: borderActiveColor, opacity: phase >= 2 ? 1 : 0, transition: reducedMotion ? "none" : "opacity 0.15s step-end" }}>{moduleId}</span>
        {status && (
          <span className={`type-label ${statusBlink && phase >= 3 && !reducedMotion ? "status-blink" : ""}`} style={{ color: statusColor, opacity: phase >= 3 ? 1 : 0 }}>{status}</span>
        )}
      </div>

      <div className="relative z-[2] p-4 md:p-6" style={{ opacity: phase >= 4 ? 1 : 0, transition: reducedMotion ? "none" : "opacity 0.05s step-end" }}>
        {children}
      </div>
    </div>
  );
}
