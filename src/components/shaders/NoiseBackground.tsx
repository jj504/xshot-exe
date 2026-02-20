"use client";

import { useEffect, useRef } from "react";

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a small tile rendered at low-res, stretched via CSS
    const SIZE = 128;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let animId: number;
    const imageData = ctx.createImageData(SIZE, SIZE);
    const buf = imageData.data;

    const animate = () => {
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 20) | 0;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 12;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(animate);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 9999, mixBlendMode: "screen", imageRendering: "auto" }}
    />
  );
}
