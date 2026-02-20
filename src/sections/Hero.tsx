"use client";

import { useState, useEffect } from "react";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import SignalButton from "@/components/ui/SignalButton";
import Module from "@/components/ui/Module";
import CharacterGrid from "@/components/ui/CharacterGrid";

export default function Hero() {
  const [phase, setPhase] = useState(0);
  // 0=init, 1=preheadline typing, 2=headline decode, 3=subline, 4=cta visible, 5=fully booted

  useEffect(() => {
    // Auto-start on mount
    setPhase(1);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center z-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Copy — Left */}
          <div className="flex-1 lg:max-w-[55%] space-y-8">
            {/* Pre-headline */}
            <div className="type-label" style={{ color: "var(--signal-cyan-60)" }}>
              <TypewriterText
                text="RX-00 / EXECUTION CONTRACTS FOR AI PIPELINES"
                active={phase >= 1}
                charDelay={15}
                onComplete={() => setPhase(2)}
              />
            </div>

            {/* Headline */}
            <h1
              className="type-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                color: "var(--phosphor-white)",
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
                onComplete={() => setPhase(3)}
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
                className="block font-mono"
                onComplete={() => setPhase(4)}
              />
            </div>

            {/* CTA Button */}
            <div style={{ opacity: phase >= 4 ? 1 : 0, transition: "none" }}>
              <SignalButton text="request access" active={phase >= 4} />
            </div>
          </div>

          {/* Animation — Right */}
          <div className="flex-1 lg:max-w-[45%] w-full">
            <Module
              moduleId="SYS-00"
              status={phase >= 5 ? "LOCKED" : "RECEIVING..."}
              statusColor={phase >= 5 ? "var(--signal-cyan-100)" : "var(--signal-cyan-60)"}
              active={phase >= 1}
              delay={0}
              onBooted={() => setPhase(5)}
              className="w-full"
            >
              <CharacterGrid active={phase >= 1} />
            </Module>
          </div>
        </div>
      </div>
    </section>
  );
}
