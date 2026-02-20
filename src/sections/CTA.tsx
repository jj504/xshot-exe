"use client";

import { useState } from "react";
import { useScrollActivation } from "@/lib/useScrollActivation";
import TypewriterText from "@/components/ui/TypewriterText";
import DecodeText from "@/components/ui/DecodeText";
import SignalButton from "@/components/ui/SignalButton";
import Module from "@/components/ui/Module";

export default function CTA() {
  const { ref, isActive } = useScrollActivation(0.2);
  const [moduleBooted, setModuleBooted] = useState(false);
  const [headlineDone, setHeadlineDone] = useState(false);
  const [taglineDone, setTaglineDone] = useState(false);

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-screen flex items-center py-24"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Section Label */}
        <div className="type-label mb-12" style={{ color: "var(--signal-cyan-60)" }}>
          <TypewriterText
            text="TX-00 / OPEN CHANNEL"
            active={isActive}
            charDelay={15}
          />
        </div>

        {/* CTA Module */}
        <div className="flex justify-center">
          <Module
            moduleId="TX-00"
            active={isActive}
            delay={400}
            onBooted={() => setModuleBooted(true)}
            className="w-full max-w-[700px]"
          >
            <div className="space-y-8 py-4">
              {/* Headline */}
              <div>
                <h2
                  className="type-display"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    color: "var(--phosphor-white)",
                  }}
                >
                  <DecodeText
                    text="you have a pipeline that works"
                    preset="headline"
                    active={moduleBooted}
                    className="block"
                  />
                  <DecodeText
                    text="until it doesn't."
                    preset="headline"
                    active={moduleBooted}
                    delay={400}
                    onComplete={() => setHeadlineDone(true)}
                    className="block"
                  />
                </h2>
              </div>

              {/* Tagline */}
              <div>
                <p
                  className="type-display"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                    color: "var(--signal-cyan-100)",
                  }}
                >
                  <DecodeText
                    text="we make it boring."
                    preset="dramatic"
                    active={headlineDone}
                    delay={300}
                    onComplete={() => setTaglineDone(true)}
                  />
                </p>
              </div>

              {/* CTA Button */}
              <div style={{ opacity: taglineDone ? 1 : 0 }}>
                <SignalButton text="request access" large active={taglineDone} />
              </div>

              {/* Sub-label */}
              <div
                style={{
                  opacity: taglineDone ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                <span
                  className="type-label"
                  style={{ color: "var(--signal-ghost)", fontSize: "var(--text-label)" }}
                >
                  currently onboarding by invite
                </span>
              </div>
            </div>
          </Module>
        </div>
      </div>
    </section>
  );
}
