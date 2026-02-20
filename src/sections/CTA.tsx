"use client";

import { useState, useEffect, useCallback } from "react";
import { useScrollActivation } from "@/lib/useScrollActivation";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import SignalButton from "@/components/ui/SignalButton";
import Module from "@/components/ui/Module";

export default function CTA() {
  const { ref, isActive } = useScrollActivation(0.15);
  const [moduleBooted, setModuleBooted] = useState(false);
  const [headlineDone, setHeadlineDone] = useState(false);
  const [taglineDone, setTaglineDone] = useState(false);
  const [labelLit, setLabelLit] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setScrollProgress(Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  const onModuleBooted = useCallback(() => setModuleBooted(true), []);
  const onHeadlineDone2 = useCallback(() => setHeadlineDone(true), []);
  const onTaglineDone2 = useCallback(() => setTaglineDone(true), []);

  return (
    <section ref={ref} className="relative z-10" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "96px", paddingBottom: "96px", marginTop: "80px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--signal-ghost) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.12 + scrollProgress * 0.2 }} aria-hidden="true" />

      <div style={{ position: "relative", width: "100%", maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "clamp(24px, 4vw, 48px)", paddingRight: "clamp(24px, 4vw, 48px)" }}>
        <div className="type-label" style={{ color: labelLit ? "var(--signal-cyan-60)" : "var(--signal-ghost)", transition: "color 0.3s", marginBottom: "48px" }}>
          <TypewriterText text="TX-00 / OPEN CHANNEL" active={isActive} charDelay={15} onComplete={() => setLabelLit(true)} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Module moduleId="TX-00" active={isActive} delay={400} drawDuration={300} onBooted={onModuleBooted} className="w-full" style={{ maxWidth: "700px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "16px", paddingBottom: "24px" }}>
              <h2 className="type-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--phosphor-white)", fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                <DecodeText text="you have a pipeline that works" preset="headline" active={moduleBooted} className="block" />
                <DecodeText text="until it doesn't." preset="headline" active={moduleBooted} delay={400} onComplete={onHeadlineDone2} className="block" />
              </h2>

              <p className="type-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "var(--signal-cyan-100)", fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                <DecodeText text="we make it boring." preset="dramatic" active={headlineDone} delay={300} onComplete={onTaglineDone2} />
              </p>

              <div style={{ opacity: taglineDone ? 1 : 0, transition: "none" }}>
                <SignalButton text="request access" large active={taglineDone} />
              </div>

              <div style={{ opacity: taglineDone ? 1 : 0, transition: "opacity 0.4s ease" }}>
                <span className="type-label" style={{ color: "var(--signal-ghost)" }}>currently onboarding by invite</span>
              </div>
            </div>
          </Module>
        </div>
      </div>
    </section>
  );
}
