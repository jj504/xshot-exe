"use client";

import { useEffect, useRef, useCallback } from "react";

const SCRAMBLE_SET = "\u2591\u2592\u2593\u2588\u250C\u2510\u2514\u2518\u2500\u2502\u252C\u2534\u251C\u2524\u253C\u2554\u2557\u255A\u255D\u2550\u2551\u25C6\u25C7\u25CF\u25CB\u25A0\u25A1\u25B8\u25BE\u2573\u2295\u2297/:;.,*#@!?><{}[]01";

const TARGET_ART = [
  "                                        ",
  "   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                         ",
  "   \u2502  INPUT        \u2502                         ",
  "   \u2502  img 1024\u00B2    \u2502                         ",
  "   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                         ",
  "          \u2502                                ",
  "          \u25BC                                ",
  "   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                         ",
  "   \u2502  STEP-01      \u2502                         ",
  "   \u2502  upscale      \u2502\u2500\u2500 on_err \u2192 [FALLBACK]  ",
  "   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                         ",
  "          \u2502                                ",
  "          \u25BC                                ",
  "   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                         ",
  "   \u2502  STEP-02      \u2502                         ",
  "   \u2502  style_tfr    \u2502\u2500\u2500 retry: 3x             ",
  "   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                         ",
  "          \u2502                                ",
  "          \u25BC                                ",
  "   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                         ",
  "   \u2502  OUTPUT       \u2502                         ",
  "   \u2502  png 4096\u00B2    \u2502                         ",
  "   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                         ",
  "                                        ",
  "   STATUS: CONTRACTED \u25A0                    ",
  "   v2.1.3 \u2014 POST /v1/rx-0847             ",
];

interface CharacterGridProps {
  active?: boolean;
  onLocked?: () => void;
}

interface Cell {
  char: string;
  target: string;
  resolved: boolean;
  opacity: number;
  cycleTimer: number;
}

export default function CharacterGrid({ active = false, onLocked }: CharacterGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[][]>([]);
  const phaseRef = useRef<"noise" | "resolve" | "ambient">("noise");
  const startRef = useRef(0);
  const animRef = useRef(0);
  const lockedFired = useRef(false);
  const onLockedRef = useRef(onLocked);
  onLockedRef.current = onLocked;

  const COLS = 40;
  const ROWS = TARGET_ART.length;

  const initCells = useCallback(() => {
    const cells: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        const target = TARGET_ART[r]?.[c] || " ";
        row.push({
          char: SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)],
          target,
          resolved: false,
          opacity: 0.4,
          cycleTimer: 0,
        });
      }
      cells.push(row);
    }
    return cells;
  }, [ROWS]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const cells = initCells();
      cells.forEach(row => row.forEach(cell => {
        cell.resolved = true; cell.char = cell.target; cell.opacity = 1;
      }));
      cellsRef.current = cells;
      phaseRef.current = "ambient";
      if (!lockedFired.current) { lockedFired.current = true; onLockedRef.current?.(); }
    } else {
      cellsRef.current = initCells();
      phaseRef.current = "noise";
    }
    startRef.current = performance.now();

    const CW = canvas.width / COLS;
    const CH = canvas.height / ROWS;
    const cx = COLS / 2, cy = ROWS / 2;
    const maxD = Math.sqrt(cx * cx + cy * cy);
    let lastRipple = 0;
    let cursorOn = true;
    let lastCursorToggle = 0;
    let lastRetryFlicker = 0;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cells = cellsRef.current;

      if (phaseRef.current === "noise" && elapsed > 1500) phaseRef.current = "resolve";
      if (phaseRef.current === "resolve" && elapsed > 4000) {
        phaseRef.current = "ambient";
        cells.forEach(row => row.forEach(cell => {
          cell.resolved = true; cell.char = cell.target; cell.opacity = 1;
        }));
        if (!lockedFired.current) { lockedFired.current = true; onLockedRef.current?.(); }
      }

      // Cursor blink for STATUS line (row 24)
      if (phaseRef.current === "ambient") {
        if (elapsed - lastCursorToggle > 1000) {
          cursorOn = !cursorOn;
          lastCursorToggle = elapsed;
        }
      }

      // Retry flicker (row 15, "retry: 3x")
      let retryFlickering = false;
      if (phaseRef.current === "ambient" && elapsed - lastRetryFlicker > 8000) {
        lastRetryFlicker = elapsed;
        retryFlickering = true;
      }

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = cells[r][c];

          if (phaseRef.current === "noise") {
            if (elapsed - cell.cycleTimer > 60) {
              cell.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
              cell.cycleTimer = elapsed;
            }
            cell.opacity = 0.4;
          } else if (phaseRef.current === "resolve" && !cell.resolved) {
            const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
            const resolveTime = 1500 + (dist / maxD) * 2500;
            if (elapsed > resolveTime) {
              cell.resolved = true; cell.char = cell.target; cell.opacity = 1;
            } else {
              if (elapsed - cell.cycleTimer > 60) {
                cell.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
                cell.cycleTimer = elapsed;
              }
              cell.opacity = 0.4 + 0.6 * Math.max(0, (elapsed - resolveTime + 500) / 500);
            }
          }

          // Ambient: retry flicker on row 15 cols 19+
          if (phaseRef.current === "ambient" && retryFlickering && r === 15 && c >= 19 && cell.target !== " ") {
            cell.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
            setTimeout(() => { cell.char = cell.target; }, 120);
          }

          let ch = cell.char;
          // Cursor blink on STATUS line
          if (phaseRef.current === "ambient" && r === 24 && c === 24) {
            ch = cursorOn ? "\u25A0" : " ";
          }

          if (ch !== " ") {
            const line = TARGET_ART[r] || "";
            let color: string;
            if (!cell.resolved) {
              color = `rgba(0, 240, 255, ${cell.opacity})`;
            } else if ((line.includes("on_err") || line.includes("retry:")) && c > 18) {
              color = `rgba(176, 196, 196, ${cell.opacity})`;
            } else if (line.includes("v2.1.3")) {
              color = `rgba(176, 196, 196, ${cell.opacity})`;
            } else {
              color = `rgba(0, 240, 255, ${cell.opacity})`;
            }

            ctx.fillStyle = color;
            ctx.font = `${Math.floor(CH * 0.78)}px "JetBrains Mono", monospace`;
            ctx.fillText(ch, c * CW, r * CH + CH * 0.8);
          }
        }
      }

      // Ambient noise ripple
      if (phaseRef.current === "ambient" && elapsed - lastRipple > 11000) {
        lastRipple = elapsed;
        const count = Math.floor(COLS * ROWS * 0.05);
        for (let i = 0; i < count; i++) {
          const rr = Math.floor(Math.random() * ROWS);
          const cc = Math.floor(Math.random() * COLS);
          const c2 = cells[rr][cc];
          if (c2.target === " ") continue;
          c2.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
          c2.opacity = 0.6;
          setTimeout(() => { c2.char = c2.target; c2.opacity = 1; }, 300);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, initCells, ROWS]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={Math.ceil(ROWS * 16)}
      className="w-full max-w-[520px] h-auto"
      style={{ imageRendering: "auto" }}
    />
  );
}
