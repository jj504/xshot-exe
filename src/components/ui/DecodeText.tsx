"use client";

import { useEffect, useRef, useState } from "react";
import { SCRAMBLE_CHARS, DECODE_PRESETS, type DecodePreset } from "@/lib/timing";

interface DecodeTextProps {
  text: string;
  preset?: DecodePreset;
  active?: boolean;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export default function DecodeText({
  text,
  preset = "body",
  active = false,
  delay = 0,
  className = "",
  onComplete,
}: DecodeTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const doneRef = useRef(false);
  const frameRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const config = DECODE_PRESETS[preset];

  useEffect(() => {
    if (!active || doneRef.current) return;

    // Reduced motion: instant
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setDisplayText(text);
        doneRef.current = true;
        onCompleteRef.current?.();
        return;
      }
    }

    setIsDecoding(true);
    const start = performance.now() + delay;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) { frameRef.current = requestAnimationFrame(tick); return; }

      let result = "";
      let allDone = true;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || text[i] === "\n") { result += text[i]; continue; }

        const charElapsed = elapsed - i * config.staggerDelay;
        if (charElapsed >= config.charCycleDuration) {
          result += text[i];
        } else if (charElapsed > 0) {
          allDone = false;
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          allDone = false;
          result += " ";
        }
      }

      setDisplayText(result);

      if (allDone) {
        setDisplayText(text);
        setIsDecoding(false);
        doneRef.current = true;
        onCompleteRef.current?.();
      } else {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [active, text, config, delay]);

  if (!active && !doneRef.current) {
    return <span className={`${className} invisible`}>{text}</span>;
  }

  const showFringe = isDecoding && config.rgbFringe;

  return (
    <span
      className={`${className} ${showFringe ? "rgb-fringe" : ""}`}
      data-text={showFringe ? displayText : undefined}
    >
      {displayText || text}
    </span>
  );
}
