"use client";

import { useEffect, useRef, useCallback } from "react";

const SCRAMBLE_SET = `\u2591\u2592\u2593\u2588\u250C\u2510\u2514\u2518\u2500\u2502\u252C\u2534\u251C\u2524\u253C\u2554\u2557\u255A\u255D\u2550\u2551\u25C6\u25C7\u25CF\u25CB\u25A0\u25A1\u25B8\u25BE\u2573\u2295\u2297/:;.,*#@!?><{}[]01`;

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
}

interface Cell {
  char: string;
  target: string;
  resolved: boolean;
  opacity: number;
  cycleTimer: number;
}

export default function CharacterGrid({ active = false }: CharacterGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[][]>([]);
  const phaseRef = useRef<"noise" | "resolve" | "ambient">("noise");
  const startRef = useRef(0);
  const animRef = useRef(0);

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

    // Check reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Show final state immediately
      const cells = initCells();
      cells.forEach(row => row.forEach(cell => {
        cell.resolved = true;
        cell.char = cell.target;
        cell.opacity = 1;
      }));
      cellsRef.current = cells;
      phaseRef.current = "ambient";
    } else {
      cellsRef.current = initCells();
      phaseRef.current = "noise";
    }
    startRef.current = performance.now();

    const CELL_W = canvas.width / COLS;
    const CELL_H = canvas.height / ROWS;
    const centerX = COLS / 2;
    const centerY = ROWS / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    let lastNoiseRipple = 0;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cells = cellsRef.current;

      // Phase transitions
      if (phaseRef.current === "noise" && elapsed > 1500) {
        phaseRef.current = "resolve";
      }
      if (phaseRef.current === "resolve" && elapsed > 4000) {
        phaseRef.current = "ambient";
        // Force all resolved
        cells.forEach(row => row.forEach(cell => {
          cell.resolved = true;
          cell.char = cell.target;
          cell.opacity = 1;
        }));
      }

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = cells[r][c];

          if (phaseRef.current === "noise") {
            // Cycle characters
            if (elapsed - cell.cycleTimer > 60) {
              cell.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
              cell.cycleTimer = elapsed;
            }
            cell.opacity = 0.4;
          } else if (phaseRef.current === "resolve" && !cell.resolved) {
            const dist = Math.sqrt((c - centerX) ** 2 + (r - centerY) ** 2);
            const resolveTime = 1500 + (dist / maxDist) * 2500;

            if (elapsed > resolveTime) {
              cell.resolved = true;
              cell.char = cell.target;
              cell.opacity = 1;
            } else {
              if (elapsed - cell.cycleTimer > 60) {
                cell.char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
                cell.cycleTimer = elapsed;
              }
              cell.opacity = 0.4 + 0.6 * Math.max(0, (elapsed - resolveTime + 500) / 500);
            }
          }

          // Draw
          if (cell.char !== " ") {
            let color: string;
            if (cell.resolved) {
              // Check special coloring
              const line = TARGET_ART[r] || "";
              if (line.includes("on_err") || line.includes("retry:")) {
                if (c > 18) {
                  color = `rgba(176, 196, 196, ${cell.opacity})`;
                } else {
                  color = `rgba(0, 240, 255, ${cell.opacity})`;
                }
              } else if (line.includes("STATUS:") || line.includes("CONTRACTED")) {
                color = `rgba(0, 240, 255, ${cell.opacity})`;
              } else if (line.includes("v2.1.3")) {
                color = `rgba(176, 196, 196, ${cell.opacity})`;
              } else {
                color = `rgba(0, 240, 255, ${cell.opacity})`;
              }
            } else {
              color = `rgba(0, 240, 255, ${cell.opacity})`;
            }

            ctx.fillStyle = color;
            ctx.font = `${Math.floor(CELL_H * 0.8)}px "JetBrains Mono", monospace`;
            ctx.fillText(cell.char, c * CELL_W, r * CELL_H + CELL_H * 0.8);
          }
        }
      }

      // Ambient noise ripple
      if (phaseRef.current === "ambient") {
        if (elapsed - lastNoiseRipple > 10000) {
          lastNoiseRipple = elapsed;
          const count = Math.floor(COLS * ROWS * 0.05);
          for (let i = 0; i < count; i++) {
            const rr = Math.floor(Math.random() * ROWS);
            const cc = Math.floor(Math.random() * COLS);
            cells[rr][cc].char = SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
            cells[rr][cc].opacity = 0.6;
            // Schedule re-resolve
            setTimeout(() => {
              cells[rr][cc].char = cells[rr][cc].target;
              cells[rr][cc].opacity = 1;
            }, 300);
          }
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
      height={416}
      className="w-full max-w-[520px] h-auto"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
