import type { Metadata } from "next";
import { JetBrains_Mono, Bebas_Neue, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "xShot.exe — Execution Contracts for AI Pipelines",
  description:
    "Turn fragile notebooks, comfy workflows, and glue code into typed, linear pipelines with retries, fallbacks, and a stable API.",
  openGraph: {
    title: "xShot.exe — Execution Contracts for AI Pipelines",
    description:
      "Ship your pipeline. Stop babysitting it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${bebasNeue.variable} ${barlowCondensed.variable}`}
        style={{
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}
