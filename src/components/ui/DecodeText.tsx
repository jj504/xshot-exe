"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [isDone, setIsDone] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const config = DECODE_PRESETS[preset];

  const decode = useCallback(() => {
    if (!active || isDone) return;

    const startTime = performance.now() + delay;
    startTimeRef.current = startTime;
    setIsDecoding(true);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      let result = "";
      let allResolved = true;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || text[i] === "\n") {
          result += text[i];
          continue;
        }

        const charStart = i * config.staggerDelay;
        const charElapsed = elapsed - charStart;

        if (charElapsed >= config.charCycleDuration) {
          result += text[i];
        } else if (charElapsed > 0) {
          allResolved = false;
          const scrambleIdx = Math.floor(Math.random() * SCRAMBLE_CHARS.length);
          result += SCRAMBLE_CHARS[scrambleIdx];
        } else {
          allResolved = false;
          result += " ";
        }
      }

      setDisplayText(result);

      if (allResolved) {
        setDisplayText(text);
        setIsDecoding(false);
        setIsDone(true);
        onComplete?.();
      } else {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, text, config, delay, onComplete, isDone]);

  useEffect(() => {
    if (active && !isDone) {
      const cleanup = decode();
      return cleanup;
    }
  }, [active, decode, isDone]);

  // Reduced motion: show text immediately
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches && active) {
        setDisplayText(text);
        setIsDone(true);
        onComplete?.();
      }
    }
  }, [active, text, onComplete]);

  if (!active && !isDone) {
    return <span className={`${className} opacity-0`}>{text}</span>;
  }

  return (
    <span
      className={`${className} ${isDecoding && config.rgbFringe ? "rgb-fringe" : ""}`}
      data-text={isDecoding ? displayText : undefined}
    >
      {displayText || text}
    </span>
  );
}
