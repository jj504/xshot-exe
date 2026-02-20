"use client";

import { useEffect, useRef, useState } from "react";

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
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || doneRef.current) return;

    const t1 = setTimeout(() => {
      setShowCursor(true);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setTimeout(() => {
            setShowCursor(false);
            doneRef.current = true;
            onCompleteRef.current?.();
          }, cursorDuration);
        }
      }, charDelay);
    }, delay);

    return () => clearTimeout(t1);
  }, [active, text, delay, charDelay, cursorDuration]);

  if (!active && !doneRef.current) {
    return <span className={`${className} invisible`}>{text}</span>;
  }

  return (
    <span className={className}>
      {displayed}
      {showCursor && <span className="cursor-blink">{"\u2588"}</span>}
    </span>
  );
}
