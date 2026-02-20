"use client";

import { useState, useCallback } from "react";
import { useScrollActivation } from "@/lib/useScrollActivation";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import Module from "@/components/ui/Module";
import ErrorLog from "@/components/ui/ErrorLog";
import PipelineStatus from "@/components/ui/PipelineStatus";
import GlyphDivider from "@/components/ui/GlyphDivider";

export default function HowItWorks() {
  const { ref, isActive } = useScrollActivation(0.15);
  const [leftBooted, setLeftBooted] = useState(false);
  const [rightBooted, setRightBooted] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);

  const onLeftBooted = useCallback(() => setLeftBooted(true), []);
  const onRightBooted = useCallback(() => {
    setRightBooted(true);
    setTimeout(() => setCopyVisible(true), 500);
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 py-24 md:py-32"
      style={{ marginTop: "80px" }}
    >
      {/* Section-specific dot grid brightening */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--signal-ghost) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.15,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Label */}
        <div className="type-label mb-12" style={{ color: "var(--signal-cyan-60)" }}>
          <TypewriterText
            text="RX-01 / PIPELINE CONTRACTION"
            active={isActive}
            charDelay={15}
          />
        </div>

        {/* Two Panels */}
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left — BEFORE */}
          <div className="flex-1 min-w-0">
            <Module
              moduleId="DIAG-00"
              status="FRAGILE"
              statusColor="var(--interference-orange)"
              active={isActive}
              delay={200}
              onBooted={onLeftBooted}
            >
              <ErrorLog active={leftBooted} />
            </Module>
          </div>

          {/* Glyph Divider */}
          <div className="flex items-center justify-center lg:px-5 py-6 lg:py-0">
            <div className="hidden lg:block">
              <GlyphDivider active={isActive} vertical={true} />
            </div>
            <div className="lg:hidden">
              <GlyphDivider active={isActive} vertical={false} />
            </div>
          </div>

          {/* Right — AFTER */}
          <div className="flex-1 min-w-0">
            <Module
              moduleId="DIAG-01"
              status="CONTRACTED"
              statusColor="var(--signal-cyan-100)"
              active={isActive}
              delay={600}
              onBooted={onRightBooted}
            >
              <PipelineStatus active={rightBooted} />
            </Module>
          </div>
        </div>

        {/* Copy Below */}
        <div className="mt-16 space-y-1" style={{ fontSize: "var(--text-system-lg)" }}>
          <DecodeText
            text="notebooks, scripts, comfy workflows, jupyter, glue code."
            preset="body"
            active={copyVisible}
            className="block font-mono"
          />
          <DecodeText
            text="whatever you have, contract it into a linear typed pipeline."
            preset="body"
            active={copyVisible}
            delay={650}
            className="block font-mono"
          />
          <DecodeText
            text="retries, fallbacks, cost limits, versioned api. handled."
            preset="body"
            active={copyVisible}
            delay={1300}
            className="block font-mono"
          />
        </div>
      </div>
    </section>
  );
}
