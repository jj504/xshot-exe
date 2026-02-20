"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ModuleProps {
  moduleId: string;
  status?: string;
  statusColor?: string;
  active?: boolean;
  delay?: number;
  borderColor?: string;
  children: ReactNode;
  className?: string;
  onBooted?: () => void;
}

export default function Module({
  moduleId,
  status,
  statusColor = "var(--signal-cyan-100)",
  active = false,
  delay = 0,
  children,
  className = "",
  onBooted,
}: ModuleProps) {
  const [phase, setPhase] = useState(0);
  // 0 = hidden, 1 = border drawing, 2 = id visible, 3 = status visible, 4 = content visible

  useEffect(() => {
    if (!active) return;

    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase(1), delay));
    timers.push(setTimeout(() => setPhase(2), delay + 200));
    timers.push(setTimeout(() => setPhase(3), delay + 350));
    timers.push(setTimeout(() => {
      setPhase(4);
      onBooted?.();
    }, delay + 500));

    return () => timers.forEach(clearTimeout);
  }, [active, delay, onBooted]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        border: `1px solid ${phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)"}`,
        background: "var(--void-black)",
        transition: phase >= 1 ? "border-color 0.2s" : "none",
      }}
    >
      {/* Corner marks */}
      <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2" style={{ borderColor: phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)" }} />
      <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2" style={{ borderColor: phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)" }} />
      <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2" style={{ borderColor: phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)" }} />
      <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2" style={{ borderColor: phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)" }} />

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 text-xs font-mono" style={{ borderBottom: "1px solid var(--signal-ghost)" }}>
        <span
          style={{
            color: "var(--signal-cyan-60)",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.15s",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "var(--font-barlow-condensed), monospace",
            fontSize: "var(--text-label)",
          }}
        >
          {moduleId}
        </span>
        {status && (
          <span
            style={{
              color: statusColor,
              opacity: phase >= 3 ? 1 : 0,
              transition: "opacity 0s",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-barlow-condensed), monospace",
              fontSize: "var(--text-label)",
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="p-4 md:p-6"
        style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      >
        {children}
      </div>
    </div>
  );
}
