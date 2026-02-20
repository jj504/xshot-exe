# xShot.exe

**Execution Contracts for AI Pipelines**

> Ship your pipeline. Stop babysitting it.

Turn fragile notebooks, comfy workflows, and glue code into typed, linear pipelines with retries, fallbacks, and a stable API.

## Live

**[xshot-exe.vercel.app](https://xshot-exe.vercel.app)**

## Design System: Signal Decay

This site implements the **Signal Decay** design system — a transmission aesthetic where everything on screen behaves as if it's being received, decoded, and occasionally corrupted.

### Color System

| Token | Hex | Role |
|---|---|---|
| `--void-black` | `#05080A` | Canvas. 70%+ of viewport. |
| `--signal-cyan-100` | `#00F0FF` | Primary data, headlines, active states |
| `--interference-orange` | `#FF5A1F` | Events only: CTAs, errors, conflict |
| `--phosphor-white` | `#E0F0F0` | Body text |
| `--signal-ghost` | `#1A2A2E` | Barely-visible structure |

### Typography

| Role | Font | Usage |
|---|---|---|
| Display | Bebas Neue | Headlines, section titles (always uppercase) |
| System | JetBrains Mono | Body text, data readouts, module content |
| Label | Barlow Condensed | Module IDs, classification stamps, metadata |

### Animation Presets

- **headline** — Full theatrical decode with RGB chromatic aberration
- **body** — Fast sweep for secondary text
- **label** — Typewriter character-by-character
- **dramatic** — Extended decode for key moments ("we make it boring.")
- **flicker** — Ambient value refreshes

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Framer Motion** (installed)
- **React Three Fiber + Three.js** (installed, ready for GLSL shaders)
- **Canvas-based** noise floor and character grid animations

## Project Structure

```
src/
├── app/                     # Next.js app router
│   ├── globals.css          # Signal Decay design tokens
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Landing page
├── components/
│   ├── shaders/             # Atmospheric overlays
│   │   ├── NoiseBackground  # 128x128 tiled grain (60fps)
│   │   └── ScanlineOverlay  # CRT scan effect
│   └── ui/                  # Core components
│       ├── CharacterGrid    # Hero ASCII art (canvas, 3-phase)
│       ├── DecodeText       # Character scramble decode
│       ├── TypewriterText   # Typewriter with cursor
│       ├── Module           # Rack module with SVG border draw
│       ├── SignalButton     # Orange CTA with border flash
│       ├── ErrorLog         # Terminal error log with glitch
│       ├── PipelineStatus   # Status readout with decode
│       ├── GlyphDivider     # Cycling glyph transmission line
│       └── StatusBadge      # State indicator pill
├── sections/                # Page sections
│   ├── Hero.tsx             # Hero with phased timing
│   ├── HowItWorks.tsx       # Before/After comparison
│   ├── CTA.tsx              # "Open Channel" with power-up
│   └── Footer.tsx           # System status bar
├── lib/
│   ├── timing.ts            # Animation constants + presets
│   └── useScrollActivation  # Intersection Observer hook
└── docs/                    # Design specs
```

## Development

```bash
npm install
npm run dev
```

## Deploy

Vercel auto-deploys from `main`. Manual:

```bash
vercel --prod
```

---

*You are intercepting a live data stream from somewhere you can't identify.*
