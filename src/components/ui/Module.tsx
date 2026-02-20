"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ModuleProps {
  moduleId: string;
  status?: string;
  statusColor?: string;
  active?: boolean;
  delay?: number;
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
  // 0=hidden 1=border drawing 2=id 3=status 4=content

  useEffect(() => {
    if (!active) return;
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), delay));
    t.push(setTimeout(() => setPhase(2), delay + 200));
    t.push(setTimeout(() => setPhase(3), delay + 350));
    t.push(setTimeout(() => { setPhase(4); onBooted?.(); }, delay + 500));
    return () => t.forEach(clearTimeout);
  }, [active, delay, onBooted]);

  const borderColor = phase >= 1 ? "var(--signal-cyan-60)" : "var(--signal-ghost)";

  return (
    <div
      className={`relative ${phase >= 1 ? "module-border-draw" : ""} ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: "var(--void-black)",
      }}
    >
      {/* Corner registration marks */}
      {[
        "top-[-1px] left-[-1px] border-t-2 border-l-2",
        "top-[-1px] right-[-1px] border-t-2 border-r-2",
        "bottom-[-1px] left-[-1px] border-b-2 border-l-2",
        "bottom-[-1px] right-[-1px] border-b-2 border-r-2",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 ${pos}`}
          style={{ borderColor }}
        />
      ))}

      {/* Header bar */}
      <div
        className="flex justify-between items-center px-4 py-2"
        style={{ borderBottom: `1px solid var(--signal-ghost)` }}
      >
        <span
          className="type-label"
          style={{
            color: "var(--signal-cyan-60)",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.15s step-end",
          }}
        >
          {moduleId}
        </span>
        {status && (
          <span
            className="type-label"
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
        className="p-4 md:p-6"
        style={{ opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.05s step-end" }}
      >
        {children}
      </div>
    </div>
  );
}
