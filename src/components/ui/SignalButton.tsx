"use client";

import { useState, useEffect, useRef } from "react";

interface SignalButtonProps {
  text: string;
  active?: boolean;
  href?: string;
  className?: string;
  large?: boolean;
}

export default function SignalButton({
  text,
  active = true,
  href = "#",
  className = "",
  large = false,
}: SignalButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [flash, setFlash] = useState(false);
  const appeared = useRef(false);

  // Single-frame flash on first appearance
  useEffect(() => {
    if (active && !appeared.current) {
      appeared.current = true;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!active) return null;

  return (
    <a
      href={href}
      className={`inline-block font-mono uppercase tracking-widest border cursor-pointer no-underline ${flash ? "border-flash" : ""} ${large ? "px-10 py-4 text-base" : "px-6 py-3 text-sm"} ${className}`}
      style={{
        borderColor: "var(--interference-orange)",
        color: hovered ? "var(--void-black)" : "var(--interference-orange)",
        backgroundColor: hovered ? "var(--interference-orange)" : "transparent",
        borderRadius: "9999px",
        borderWidth: "1px",
        transition: "none",
        letterSpacing: "0.12em",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
    </a>
  );
}
