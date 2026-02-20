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
  const [labelLit, setLabelLit] = useState(false);

  const onLeftBooted = useCallback(() => setLeftBooted(true), []);
  const onRightBooted = useCallback(() => {
    setRightBooted(true);
    setTimeout(() => setCopyVisible(true), 500);
  }, []);

  return (
    <section ref={ref} className="relative z-10" style={{ paddingTop: "96px", paddingBottom: "128px", marginTop: "80px" }}>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--signal-ghost) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.15 }} aria-hidden="true" />
      )}

      <div style={{ position: "relative", maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "clamp(24px, 4vw, 48px)", paddingRight: "clamp(24px, 4vw, 48px)" }}>
        <div className="type-label" style={{ color: labelLit ? "var(--signal-cyan-60)" : "var(--signal-ghost)", transition: "color 0.3s", marginBottom: "48px" }}>
          <TypewriterText text="RX-01 / HOW IT WORKS" active={isActive} charDelay={15} onComplete={() => setLabelLit(true)} />
        </div>

        <div className="flex flex-col lg:flex-row" style={{ alignItems: "stretch" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Module moduleId="DIAG-00" status="FRAGILE" statusColor="var(--interference-orange)" active={isActive} delay={200} borderActiveColor="var(--signal-ghost-light)" onBooted={onLeftBooted}>
              <ErrorLog active={leftBooted} />
            </Module>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
            <div className="hidden lg:block"><GlyphDivider active={isActive} vertical={true} /></div>
            <div className="lg:hidden"><GlyphDivider active={isActive} vertical={false} /></div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Module moduleId="DIAG-01" status="CONTRACTED" statusColor="var(--signal-cyan-100)" active={isActive} delay={600} borderActiveColor="var(--signal-cyan-60)" onBooted={onRightBooted}>
              <PipelineStatus active={rightBooted} />
            </Module>
          </div>
        </div>

        <div style={{ marginTop: "64px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "var(--text-system-lg)" }}>
          <DecodeText text="no more 3am debugging. no more $4 retries that go nowhere." preset="body" active={copyVisible} className="block font-mono" />
          <DecodeText text="the agent builds the pipeline, handles the failures," preset="body" active={copyVisible} delay={650} className="block font-mono" />
          <DecodeText text="and gives you an endpoint that just works." preset="body" active={copyVisible} delay={1300} className="block font-mono" />
        </div>
      </div>
    </section>
  );
}
