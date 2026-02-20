"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(38 + Math.floor(Math.random() * 10));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="relative z-10"
      style={{ borderTop: "1px solid var(--signal-ghost)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div
            className="type-label"
            style={{ color: "var(--phosphor-dim)", fontSize: "var(--text-label)" }}
          >
            XSHOT.EXE
          </div>

          {/* Center */}
          <div
            className="type-label flex items-center gap-2"
            style={{ color: "var(--signal-cyan-60)", fontSize: "var(--text-label)" }}
          >
            <span>SYS NOMINAL</span>
            <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
            <span>UPTIME 100%</span>
            <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
            <span>LATENCY {latency}ms</span>
          </div>

          {/* Right */}
          <div className="flex gap-8">
            {["DOCS", "CHANGELOG", "CONTACT"].map((item) => (
              <a
                key={item}
                href="#"
                className="type-label hover:text-[var(--signal-cyan-100)] transition-colors"
                style={{
                  color: "var(--phosphor-dim)",
                  fontSize: "var(--text-label)",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4">
          <span
            className="type-label"
            style={{
              color: "var(--signal-ghost)",
              opacity: 0.6,
              fontSize: "0.625rem",
            }}
          >
            {"\u00A9"} 2026 {"\u2014"} all transmissions monitored
          </span>
        </div>
      </div>
    </footer>
  );
}
