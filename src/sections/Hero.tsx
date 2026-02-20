"use client";

import { useState, useEffect, useCallback } from "react";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import SignalButton from "@/components/ui/SignalButton";
import Module from "@/components/ui/Module";
import AssemblyAnimation from "@/components/ui/AssemblyAnimation";

export default function Hero() {
  const [phase, setPhase] = useState(0);
  const [gridLocked, setGridLocked] = useState(false);
  const [labelLit, setLabelLit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 100);
    return () => clearTimeout(t);
  }, []);

  const onPreHeadlineDone = useCallback(() => {
    setLabelLit(true);
    setTimeout(() => setPhase(2), 200);
  }, []);

  const onHeadlineDone = useCallback(() => {
    setTimeout(() => setPhase(3), 300);
  }, []);

  const onSublineDone = useCallback(() => {
    setTimeout(() => setPhase(4), 200);
  }, []);

  return (
    <section
      className="relative z-10"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(24px, 4vw, 48px)",
          paddingRight: "clamp(24px, 4vw, 48px)",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
          }}
          className="lg:flex-row lg:gap-16 lg:items-center"
        >
          {/* COPY LEFT */}
          <div className="flex-1 lg:max-w-[55%]" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Pre-headline — Tier 4 ambient */}
            <div
              className="type-label"
              style={{
                color: labelLit ? "var(--signal-cyan-05)" : "var(--signal-ghost)",
                transition: "color 0.3s",
                opacity: 0.6,
              }}
            >
              <TypewriterText
                text="RX-00 / AI PIPELINE INFRASTRUCTURE"
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
                fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
              }}
            >
              <span style={{ color: "var(--phosphor-white)" }}><DecodeText text="your ai pipeline breaks at 3am." preset="headline" active={phase >= 2} className="block" /></span>
              <span style={{ color: "var(--signal-cyan-100)" }}><DecodeText text="not anymore." preset="headline" active={phase >= 2} delay={600} onComplete={onHeadlineDone} className="block" /></span>
            </h1>

            {/* Subline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "var(--text-system-lg)" }}>
              <DecodeText text="describe what your ai pipeline should do." preset="body" active={phase >= 3} className="block font-mono" />
              <DecodeText text="the agent builds it \u2014 models, retries, fallbacks, cost limits \u2014" preset="body" active={phase >= 3} delay={700} className="block font-mono" />
              <DecodeText text="and deploys it as a stable api. no infra. no babysitting." preset="body" active={phase >= 3} delay={1400} onComplete={onSublineDone} className="block font-mono" />
            </div>

            {/* CTA */}
            <div style={{ opacity: phase >= 4 ? 1 : 0, transition: "none" }}>
              <SignalButton text="request access" active={phase >= 4} />
            </div>

            {/* Anchor line — Tier 4 */}
            <div
              className="type-label"
              style={{
                color: "var(--signal-ghost)",
                opacity: phase >= 4 ? 1 : 0,
                transition: "opacity 0.4s ease",
                letterSpacing: "0.06em",
              }}
            >
              for developers building with comfyui &middot; fal &middot; replicate &middot; jupyter &middot; custom models
            </div>
          </div>

          {/* ANIMATION RIGHT */}
          <div className="flex-1 lg:max-w-[45%]" style={{ width: "100%" }}>
            <Module
              moduleId="SYS-00"
              status={gridLocked ? "LOCKED" : phase >= 1 ? "ASSEMBLING..." : ""}
              statusColor={gridLocked ? "var(--signal-cyan-100)" : "var(--signal-cyan-60)"}
              statusBlink={!gridLocked && phase >= 1}
              active={phase >= 1}
              delay={0}
              className="w-full"
            >
              <AssemblyAnimation active={phase >= 1} onLocked={() => setGridLocked(true)} />
            </Module>
          </div>
        </div>
      </div>
    </section>
  );
}
