"use client";

import { useState } from "react";

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

  if (!active) return null;

  return (
    <a
      href={href}
      className={`inline-block font-mono uppercase tracking-widest border cursor-pointer no-underline ${large ? "px-10 py-4 text-base" : "px-6 py-3 text-sm"} ${className}`}
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
