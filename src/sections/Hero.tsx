"use client";

import { useState, useEffect, useCallback } from "react";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import SignalButton from "@/components/ui/SignalButton";
import Module from "@/components/ui/Module";
import CharacterGrid from "@/components/ui/CharacterGrid";

/**
 * Timing from spec:
 *   T+0       pre-headline types out (~800ms)
 *   T+900     pre-headline done, cursor blinks 500ms
 *   T+1400    headline decode starts
 *   T+1500    character grid resolve starts
 *   T+3900    headline resolved
 *   T+4200    subline line 1
 *   T+5700    subline done
 *   T+5900    CTA snaps in
 *   T+6000    fully booted
 */
export default function Hero() {
  const [phase, setPhase] = useState(0);
  // 0=wait 1=typewriter 2=headline 3=subline 4=cta 5=ambient

  const [gridLocked, setGridLocked] = useState(false);

  useEffect(() => {
    // Kick off immediately
    const t = setTimeout(() => setPhase(1), 100);
    return () => clearTimeout(t);
  }, []);

  const onPreHeadlineDone = useCallback(() => {
    // 500ms cursor blink, then headline
    setTimeout(() => setPhase(2), 200);
  }, []);

  const onHeadlineDone = useCallback(() => {
    setTimeout(() => setPhase(3), 300);
  }, []);

  const onSublineDone = useCallback(() => {
    setTimeout(() => setPhase(4), 200);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center z-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ===== COPY LEFT ===== */}
          <div className="flex-1 lg:max-w-[55%] space-y-8">

            {/* Pre-headline */}
            <div className="type-label" style={{ color: "var(--signal-cyan-60)" }}>
              <TypewriterText
                text="RX-00 / EXECUTION CONTRACTS FOR AI PIPELINES"
                active={phase >= 1}
                charDelay={15}
                cursorDuration={500}
                onComplete={onPreHeadlineDone}
              />
            </div>

            {/* Headline */}
            <h1
              className="type-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                color: "var(--phosphor-white)",
                fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
              }}
            >
              <DecodeText
                text="ship your pipeline."
                preset="headline"
                active={phase >= 2}
                className="block"
              />
              <DecodeText
                text="stop babysitting it."
                preset="headline"
                active={phase >= 2}
                delay={600}
                onComplete={onHeadlineDone}
                className="block"
              />
            </h1>

            {/* Subline */}
            <div className="space-y-1" style={{ fontSize: "var(--text-system-lg)" }}>
              <DecodeText
                text="turn fragile notebooks, comfy workflows, and glue code into"
                preset="body"
                active={phase >= 3}
                className="block font-mono"
              />
              <DecodeText
                text="typed, linear pipelines with retries, fallbacks, and a stable api."
                preset="body"
                active={phase >= 3}
                delay={700}
                className="block font-mono"
              />
              <DecodeText
                text="deploy once. behavior is predictable. failures are explainable."
                preset="body"
                active={phase >= 3}
                delay={1400}
                onComplete={onSublineDone}
                className="block font-mono"
              />
            </div>

            {/* CTA */}
            <div
              style={{
                opacity: phase >= 4 ? 1 : 0,
                transition: "none",
              }}
            >
              <SignalButton text="request access" active={phase >= 4} />
            </div>
          </div>

          {/* ===== GRID RIGHT ===== */}
          <div className="flex-1 lg:max-w-[45%] w-full">
            <Module
              moduleId="SYS-00"
              status={gridLocked ? "LOCKED" : phase >= 1 ? "RECEIVING..." : ""}
              statusColor={gridLocked ? "var(--signal-cyan-100)" : "var(--signal-cyan-60)"}
              active={phase >= 1}
              delay={0}
              className="w-full"
            >
              <CharacterGrid
                active={phase >= 1}
                onLocked={() => setGridLocked(true)}
              />
            </Module>
          </div>
        </div>
      </div>
    </section>
  );
}
