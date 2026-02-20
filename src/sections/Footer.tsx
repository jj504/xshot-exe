"use client";

import { useEffect, useState, useRef } from "react";
import { SCRAMBLE_CHARS } from "@/lib/timing";

function useFlickerValue(baseValue: string, updateInterval: number) {
  const [display, setDisplay] = useState(baseValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Brief scramble
      const scrambled = baseValue
        .split("")
        .map((c) => (c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
        .join("");
      setDisplay(scrambled);
      setTimeout(() => setDisplay(baseValue), 80);
    }, updateInterval);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [baseValue, updateInterval]);

  return display;
}

export default function Footer() {
  const [latency, setLatency] = useState(42);
  const latencyDisplay = useFlickerValue(`LATENCY ${latency}ms`, 7000);

  useEffect(() => {
    const iv = setInterval(() => {
      setLatency(38 + Math.floor(Math.random() * 10));
    }, 7000);
    return () => clearInterval(iv);
  }, []);

  return (
    <footer className="relative z-10" style={{ borderTop: "1px solid var(--signal-ghost)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="type-label" style={{ color: "var(--phosphor-dim)" }}>
            XSHOT.EXE
          </div>

          {/* Center */}
          <div className="type-label flex items-center gap-2" style={{ color: "var(--signal-cyan-60)" }}>
            <span>SYS NOMINAL</span>
            <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
            <span>UPTIME 100%</span>
            <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
            <span className="font-mono">{latencyDisplay}</span>
          </div>

          {/* Right */}
          <div className="flex gap-8">
            {["DOCS", "CHANGELOG", "CONTACT"].map((item) => (
              <a
                key={item}
                href="#"
                className="type-label"
                style={{
                  color: "var(--phosphor-dim)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal-cyan-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--phosphor-dim)")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="type-label" style={{ color: "var(--signal-ghost)", opacity: 0.6, fontSize: "0.625rem" }}>
            {"\u00A9"} 2026 {"\u2014"} all transmissions monitored
          </span>
        </div>
      </div>
    </footer>
  );
}
