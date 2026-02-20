"use client";

import { useEffect, useState, useRef } from "react";
import { SCRAMBLE_CHARS } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useIsMobile";

function useFlickerValue(baseValue: string, updateInterval: number) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(baseValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reducedMotion) { setDisplay(baseValue); return; }
    intervalRef.current = setInterval(() => {
      const scrambled = baseValue.split("").map((c) => (c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])).join("");
      setDisplay(scrambled);
      setTimeout(() => setDisplay(baseValue), 80);
    }, updateInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [baseValue, updateInterval, reducedMotion]);

  return display;
}

export default function Footer() {
  const [latency, setLatency] = useState(42);
  const latencyDisplay = useFlickerValue(`LATENCY ${latency}ms`, 7000);

  useEffect(() => {
    const iv = setInterval(() => setLatency(38 + Math.floor(Math.random() * 10)), 7000);
    return () => clearInterval(iv);
  }, []);

  return (
    <footer className="relative z-10" style={{ borderTop: "1px solid var(--signal-ghost)" }} role="contentinfo">
      <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "clamp(24px, 4vw, 48px)", paddingRight: "clamp(24px, 4vw, 48px)", paddingTop: "24px", paddingBottom: "24px" }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }} className="md:justify-start md:flex-1">
            <div className="type-label" style={{ color: "var(--phosphor-dim)" }}>XSHOT.EXE</div>
            <div className="type-label" style={{ color: "var(--signal-cyan-60)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>SYS NOMINAL</span>
              <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
              <span>UPTIME 100%</span>
              <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
              <span className="font-mono">{latencyDisplay}</span>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "32px", justifyContent: "center" }} className="md:justify-end" aria-label="Footer links">
            {["DOCS", "CHANGELOG", "CONTACT"].map((item) => (
              <a key={item} href="#" className="type-label focus:outline-none focus:ring-1 focus:ring-[var(--signal-cyan-100)] rounded px-1"
                style={{ color: "var(--phosphor-dim)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal-cyan-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--phosphor-dim)")}
              >{item}</a>
            ))}
          </nav>
        </div>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span className="type-label" style={{ color: "var(--signal-ghost)", opacity: 0.6, fontSize: "0.625rem" }}>{"\u00A9"} 2026 {"\u2014"} all transmissions monitored</span>
        </div>
      </div>
    </footer>
  );
}
