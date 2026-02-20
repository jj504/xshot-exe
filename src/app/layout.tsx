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
  title: "xShot.exe — AI Pipeline Infrastructure",
  description:
    "Your AI pipeline breaks at 3am. An agent builds it, handles failures, and deploys it as a stable API. No infra. No babysitting.",
  openGraph: {
    title: "xShot.exe — Execution Contracts for AI Pipelines",
    description:
      "Your AI pipeline breaks at 3am. Not anymore.",
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
