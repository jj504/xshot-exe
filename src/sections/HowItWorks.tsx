"use client";

import { useState, useCallback } from "react";
import { useScrollActivation } from "@/lib/useScrollActivation";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import Module from "@/components/ui/Module";
import ErrorLog from "@/components/ui/ErrorLog";
import PipelineStatus from "@/components/ui/PipelineStatus";

export default function HowItWorks() {
  const { ref, isActive } = useScrollActivation(0.2);
  const [leftBooted, setLeftBooted] = useState(false);
  const [rightBooted, setRightBooted] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);

  const onLeftBooted = useCallback(() => setLeftBooted(true), []);
  const onRightBooted = useCallback(() => {
    setRightBooted(true);
    setTimeout(() => setCopyVisible(true), 500);
  }, []);

  return (
    <section ref={ref} className="relative z-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Label */}
        <div className="type-label mb-12" style={{ color: "var(--signal-cyan-60)" }}>
          <TypewriterText
            text="RX-01 / PIPELINE CONTRACTION"
            active={isActive}
            charDelay={15}
          />
        </div>

        {/* Panels */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Left Panel — BEFORE */}
          <div className="flex-1">
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

          {/* Center Divider */}
          <div className="flex items-center justify-center lg:px-6 py-4 lg:py-0">
            <div
              className="font-mono text-center"
              style={{ color: "var(--signal-cyan-100)" }}
            >
              <span className="hidden lg:block text-2xl" style={{ opacity: isActive ? 1 : 0.3, animation: "pulse 2s ease-in-out infinite" }}>
                {"\u25B8"}
              </span>
              <span className="lg:hidden text-2xl" style={{ opacity: isActive ? 1 : 0.3, animation: "pulse 2s ease-in-out infinite" }}>
                {"\u25BE"}
              </span>
            </div>
          </div>

          {/* Right Panel — AFTER */}
          <div className="flex-1">
            <Module
              moduleId="DIAG-01"
              status="CONTRACTED"
              statusColor="var(--signal-cyan-100)"
              active={isActive}
              delay={600}
              onBooted={onRightBooted}
              className=""
            >
              <PipelineStatus active={rightBooted} />
            </Module>
          </div>
        </div>

        {/* Copy Below Panels */}
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
