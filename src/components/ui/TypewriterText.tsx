"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  active?: boolean;
  delay?: number;
  charDelay?: number;
  className?: string;
  cursorDuration?: number;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  active = false,
  delay = 0,
  charDelay = 15,
  className = "",
  cursorDuration = 1000,
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!active || isDone) return;

    const timeout = setTimeout(() => {
      setShowCursor(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => {
            setShowCursor(false);
            setIsDone(true);
            onComplete?.();
          }, cursorDuration);
        }
      }, charDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [active, text, delay, charDelay, cursorDuration, onComplete, isDone]);

  if (!active && !isDone) {
    return <span className={`${className} opacity-0`}>{text}</span>;
  }

  return (
    <span className={className}>
      {displayed}
      {showCursor && <span className="cursor-blink">\u2588</span>}
    </span>
  );
}
