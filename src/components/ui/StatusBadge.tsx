"use client";

interface StatusBadgeProps {
  text: string;
  color?: string;
  className?: string;
}

export default function StatusBadge({ text, color = "var(--signal-cyan-100)", className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-widest ${className}`}
      style={{
        color,
        border: `1px solid ${color}`,
        fontSize: "var(--text-label)",
        letterSpacing: "0.08em",
      }}
    >
      {text}
    </span>
  );
}
