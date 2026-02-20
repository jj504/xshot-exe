"use client";

import dynamic from "next/dynamic";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";

const NoiseBackground = dynamic(() => import("@/components/shaders/NoiseBackground"), { ssr: false });
const ScanlineOverlay = dynamic(() => import("@/components/shaders/ScanlineOverlay"), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: "var(--void-black)" }}>
      {/* Atmospheric layers */}
      <div className="dot-grid" style={{ opacity: 0.35 }} aria-hidden="true" />
      <NoiseBackground />
      <ScanlineOverlay />

      {/* Content */}
      <Hero />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
