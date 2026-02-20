# Signal Decay — Design System & Development Guide

## 1. Core Philosophy

This is a **transmission aesthetic**, not a retro aesthetic. Everything on screen behaves as if it's being **received** — decoded, reconstructed, occasionally corrupted — rather than simply displayed. The fundamental metaphor: **"You are intercepting a live data stream from somewhere you can't identify."**

The interface isn't a product. It's evidence. Nothing is permanent. Everything is in a state of arrival or departure.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR, routing, component composition |
| UI Animation | **Framer Motion** | Scroll triggers, decode effects, module boot sequences |
| 3D / Shaders | **React Three Fiber + Three.js** | Noise floor, grain, generative visuals, glyph system |
| Custom Shaders | **GLSL** (via `shaderMaterial` or `glslCanvas`) | Scanlines, RGB fringing, phosphor glow, dissolution masks |
| Styling | **Tailwind CSS** | Structural layout, utility-first base styles |
| Font Loading | **next/font** | Self-hosted, optimized custom typefaces |

---

## 3. Color System

Colors are organized by **signal physics**, not conventional design roles.

```css
:root {
  /* === VOID === */
  /* The black of a screen that's on but receiving nothing. 70%+ of canvas at all times. */
  --void-black: #05080A;
  --void-deep: #0A0D10;

  /* === SIGNAL === */
  /* The carrier wave. Never flat — pulses subtly in luminosity. */
  --signal-cyan-100: #00F0FF;    /* Primary data, headlines, active states */
  --signal-cyan-60: #00F0FF99;   /* Secondary elements, depth layer */
  --signal-cyan-15: #00F0FF26;   /* Atmospheric wash, ambient glow */
  --signal-cyan-05: #00F0FF0D;   /* Barely-there grid lines, ghost traces */

  /* === INTERFERENCE === */
  /* Appears ONLY at moments of conflict, decision, or rupture. */
  /* When orange appears, something is happening. */
  --interference-orange: #FF5A1F;
  --interference-orange-80: #FF5A1FCC;
  --interference-orange-40: #FF5A1F66;

  /* === PHOSPHOR === */
  /* White with the faintest cyan memory. Body text, secondary interfaces. */
  --phosphor-white: #E0F0F0;
  --phosphor-dim: #B0C4C4;

  /* === GHOST === */
  /* Barely-visible structure. Felt more than seen. */
  --signal-ghost: #1A2A2E;
  --signal-ghost-light: #243438;
}
```

### Color Rules

- **Cyan and orange NEVER touch directly.** Always maintain a buffer of void black between them. When they come close, the tension should be palpable.
- **Orange is an event, not an accent.** Use only for: CTAs, alerts, active/conflict states, moments of narrative tension.
- **Cyan opacity = information distance.** 100% = primary/foreground. 60% = secondary. 15% = atmospheric. 5% = structural grid.
- **Pure white (#FFFFFF) does not exist** in this system. All whites carry a faint cyan cast.

---

## 4. Typography

### 4.1 Type Hierarchy

| Role | Style | Usage |
|---|---|---|
| **Display** | Ultra-heavy compressed grotesque (Druk Wide, Obviously Wide, or custom) | Hero text, section titles. ALWAYS uppercase. |
| **System** | Precision monospace (JetBrains Mono, IBM Plex Mono, or custom) | Body text, data readouts, module content. Clinical, not retro. |
| **Signal** | Generative / procedural type | Key transitions, ambient texture. Built in real-time from math, not font files. |
| **Label** | Condensed sans (DIN Condensed, Eurostile, or custom) | Module IDs, classification stamps, metadata. Always uppercase, wide letter-spacing. |

### 4.2 Type Behavior

- **Display type arrives with artifacts.** Sub-pixel color fringing (RGB offset of 1-2px) along edges, as if rendered on a misaligned display. Characters may be fractionally offset from baseline — each glyph transmitted independently with microsecond timing errors.
- **System type is quiet and precise.** No effects, no decoration. The calm center of the visual storm.
- **All headlines default to UPPERCASE** with `letter-spacing: 0.05em` minimum.
- **No font smoothing overrides.** Let the browser render at native resolution — sub-pixel rendering inconsistencies are features, not bugs.

### 4.3 Type Scale

```css
--text-display-xl: clamp(3rem, 8vw, 7rem);    /* Hero headlines */
--text-display-lg: clamp(2rem, 5vw, 4rem);     /* Section titles */
--text-display-md: clamp(1.5rem, 3vw, 2.5rem); /* Sub-headers */
--text-system-lg: 1.125rem;                      /* Lead body text */
--text-system-md: 0.9375rem;                     /* Standard body */
--text-system-sm: 0.8125rem;                     /* Secondary info */
--text-label: 0.6875rem;                          /* Module IDs, stamps */
```

---

## 5. The Glyph System

**This is the single most distinctive element. It is the brand's fingerprint.**

### 5.1 Definition

A proprietary set of **30-50 custom symbols** built from geometric primitives: dots, lines, quarter-arcs, right angles, small circles, crosshairs. They combine into larger compositions.

### 5.2 Grid Rules

- All glyphs conform to a strict **8×8 unit grid**.
- Every glyph tiles and tessellates perfectly.
- Glyphs can be combined into **2×2, 3×3, or 4×4 super-glyphs** for larger compositions.

### 5.3 Glyph Applications

- **Borders and dividers** — assembled from repeating glyph sequences
- **Section transition masks** — content dissolves through the glyph grid
- **Loading/processing states** — glyphs cycle and shuffle like a combination lock
- **Background texture** — sparse glyph fields that drift slowly
- **Data visualization** — glyphs represent values (filled vs. empty, colored vs. ghost)
- **Illustrative compositions** — larger glyph arrangements that form abstract diagrams or schematics

### 5.4 Glyph Animation

Glyphs animate by **cycling through the symbol set** before resolving to their final form. The effect is between a cellular automaton, a QR code focusing, and a language you almost understand. Timing should be **rapid but staggered** — each glyph in a sequence resolves 20-40ms after the previous one, creating a wave-like decode pattern.

### 5.5 Implementation

Build the glyph system as an **SVG sprite sheet** or as a **canvas-rendered font**. Each glyph should be addressable by index. The animation engine should accept:
- `targetGlyphs[]` — the final resolved sequence
- `scrambleDuration` — how long each glyph cycles before resolving
- `staggerDelay` — offset between sequential glyph resolutions
- `scrambleSet[]` — which glyphs to cycle through during decode

---

## 6. Layout: The Rack System

### 6.1 Core Concept

The page is an **instrument rack** — discrete modules slotted into a visible framework. Abandon conventional web layout conventions.

### 6.2 Module Anatomy

Every content block is a **module** with:

```
╔═══════════════════════════════════════════╗
║ SM-04                          ◆ ACTIVE   ║
║                                           ║
║   [Module Content]                        ║
║                                           ║
║                                           ║
╚═══════════════════════════════════════════╝
```

- **Corner registration marks** — L-shaped brackets at each corner (rendered via CSS pseudo-elements or SVG)
- **Module identifier** — alphanumeric code in the top-left (e.g., `SM-04`, `RX.BRIEF.01`, `TX-HERO.00`)
- **Status indicator** — small dot or glyph in the top-right showing module state
- **Subtle border** — 1px in `--signal-ghost`, brightening to `--signal-cyan-60` on hover/activation

### 6.3 Background Grid

A faint **dot matrix or crosshatch pattern** is visible on the background at all times — alignment grid aesthetic, like engineering paper or a CRT test pattern. Content sits on top of this grid. The grid peeks through in gaps and margins.

```css
.background-grid {
  background-image: radial-gradient(circle, var(--signal-ghost) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### 6.4 Spacing

- Base unit: **8px**
- Module internal padding: **24px–32px**
- Module-to-module gap: **16px–24px**
- Section-to-section gap: **80px–120px**
- Negative space is **active silence** — the pause between transmissions. Do not fill it.

### 6.5 Responsive Behavior

Modules reflow from multi-column racks to single-column stacks on mobile. The grid background scales proportionally. Module identifiers and registration marks remain visible at all breakpoints — they are structural, not decorative.

---

## 7. Animation System

### 7.1 Principles

| Principle | Description |
|---|---|
| **Resolve, don't reveal** | Content decodes into legibility. It doesn't fade or slide. |
| **Step, don't ease** | Motion is instantaneous or mechanically stepped. No smooth easing curves. |
| **Always alive** | The interface has a constant ambient noise floor — subtle grain, micro-flickers, faint drift. |
| **Boot, don't load** | Sections power on. They don't passively appear. |

### 7.2 Animation Types

#### Text Decode Effect
Characters cycle rapidly through random glyphs before locking to the correct character. Each character resolves sequentially with a 15-30ms stagger.

```typescript
// Pseudocode
function decodeText(target: string, duration: number) {
  for (let i = 0; i < target.length; i++) {
    // Cycle through random chars for (duration - i * stagger)ms
    // Then lock to target[i]
  }
}
```

#### Module Boot Sequence
Triggered on scroll-into-view:
1. Border draws itself (corner-to-corner, ~200ms)
2. Module ID types in (character by character, ~150ms)
3. Status indicator blinks on (instant)
4. Internal content decodes (staggered, ~300-500ms)
5. Data values count to final state (stepped, ~400ms)

#### Pixel Dissolution
Content materializes or disintegrates through a grid-aligned noise mask. Not smooth alpha fade — **blocky, dithered, pixel-level**.

Implement via: GLSL shader with a noise texture as alpha mask, animated threshold value.

#### Scanline Drift
A subtle, slow-moving horizontal brightness variation across the full viewport. Nearly invisible — ~2-3% opacity shift. Creates subliminal CRT presence.

Implement via: Full-screen shader overlay with animated sine wave.

#### Noise Floor
Constant, ambient grain across the void black background. Shifts every frame but at very low contrast (~3-5% variation). Communicates liveness.

Implement via: GLSL noise function rendered to a full-screen quad, or a pre-rendered noise texture that translates every frame.

### 7.3 Timing Constants

```typescript
const TIMING = {
  INSTANT: 0,               // Data snap — no transition
  CHAR_STAGGER: 20,          // ms between sequential character decodes
  GLYPH_CYCLE: 60,           // ms per glyph cycle frame
  MODULE_BORDER_DRAW: 200,   // ms to draw a module border
  MODULE_BOOT_TOTAL: 800,    // ms for full module boot sequence
  VALUE_COUNT_STEP: 16,      // ms per step in numeric count-up
  SCAN_DRIFT_PERIOD: 8000,   // ms for one full scanline cycle
  NOISE_FRAME: 16,           // ms per noise floor frame (~60fps)
} as const;
```

### 7.4 Scroll Trigger Behavior

Use Framer Motion's `useInView` or Intersection Observer. Modules boot **once** when they enter the viewport (threshold: 0.2). No reverse animations on scroll-out — once a module is online, it stays online.

---

## 8. Component Library

### 8.1 Core Components

```
<Module>              — Base container with border, ID, registration marks
<ModuleHeader>        — Module title + status indicator
<DecodeText>          — Text with character-decode animation
<GlyphField>          — Canvas/SVG rendered glyph composition
<GlyphBorder>         — Animated border built from glyph sequences
<ProgressReadout>     — Stepped progress bar with numeric readout
<DataValue>           — Numeric display with count-up animation
<StatusBadge>         — Small pill showing state (ACTIVE, STANDBY, etc.)
<SystemNav>           — Navigation as command structure / directory
<SignalButton>        — CTA with mechanical hover/click feedback
<NoiseBackground>     — Full-viewport shader layer
<ScanlineOverlay>     — Subtle CRT scan effect
<BootSequence>        — Orchestrates module power-on animation
<TransmissionDivider> — Section separator using glyph patterns
```

### 8.2 Navigation Pattern

Navigation is presented as a **system directory**, not a conventional menu:

```
/RX-00  OVERVIEW
/RX-01  CAPABILITY
/RX-02  PROTOCOL
/RX-03  TRANSMISSION LOG
/TX-00  OPEN CHANNEL          ← CTA (interference-orange)
```

- Items are monospaced, uppercase, with protocol-style prefixes.
- Active state: full `--signal-cyan-100` with a blinking cursor or `▸` prefix.
- Hover state: module ID code flickers, text brightens from ghost to full phosphor.
- The CTA is the only orange element in the nav — it's the only item that breaks protocol.

### 8.3 Button States

```
DEFAULT:    1px border --signal-ghost, text --phosphor-dim
HOVER:      1px border --signal-cyan-60, text --signal-cyan-100, 
            brief ID flicker in corner
ACTIVE:     Background flash --signal-cyan-15, border --signal-cyan-100,
            instant snap (no transition)
CTA:        Border --interference-orange, text --interference-orange,
            hover fills background --interference-orange with text --void-black
```

---

## 9. Shader Reference

### 9.1 Noise Floor Shader (Fragment)

```glsl
uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float noise = random(st + u_time * 0.1);
  float grain = mix(0.0, 0.05, noise); // Very subtle — 5% max
  gl_FragColor = vec4(vec3(grain), 1.0);
}
```

### 9.2 RGB Fringe Effect (CSS Approximation)

For display type that appears mis-registered:

```css
.rgb-fringe {
  position: relative;
  color: var(--phosphor-white);
}
.rgb-fringe::before,
.rgb-fringe::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
}
.rgb-fringe::before {
  color: rgba(0, 240, 255, 0.6);
  transform: translate(-1.5px, 0);
  clip-path: inset(0 0 50% 0);
}
.rgb-fringe::after {
  color: rgba(255, 90, 31, 0.4);
  transform: translate(1.5px, 0);
  clip-path: inset(50% 0 0 0);
}
```

### 9.3 Scanline Overlay (CSS)

```css
.scanlines {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}
```

---

## 10. Data as Decoration

Wherever traditional design would use imagery, this system uses **data readouts and generative visualizations**:

- **Hero section** → Large, slowly evolving generative visualization (waveform, network graph, particle field)
- **Sidebar elements** → Simulated-live metrics: uptime counters, transmission logs, coordinate readouts, signal strength bars
- **Section backgrounds** → Sparse glyph fields with slow drift
- **Testimonials / social proof** → Formatted as intercepted transmission logs with timestamps and signal metadata

These don't need to represent real data. They populate the interface with the **texture of active computation**. The user should feel surrounded by information, most of which isn't meant for them.

---

## 11. Interaction Language

### Naming Conventions

Standard web terminology is replaced with signal/protocol language:

| Standard | Signal Decay |
|---|---|
| Get Started | Initialize / Open Channel |
| Learn More | Expand Signal / Deep Scan |
| Sign Up | Request Access |
| Contact Us | Transmit |
| Dashboard | Control Surface |
| Settings | Configuration |
| Log In | Authenticate |
| Submit | Confirm Transmission |
| Loading... | Acquiring Signal... |
| Error | Signal Lost / Transmission Failure |
| Success | Signal Confirmed / Transmission Complete |
| Menu | Directory |
| Home | Origin / RX-00 |

### Interaction Feedback

- **Hover** → Module border brightens, ID code blinks, small readout updates
- **Click** → Hard color shift, single-frame inversion, decisive mechanical snap
- **Focus** → Cursor becomes a blinking block `█`, input borders glow cyan
- **Disabled** → Elements drop to ghost opacity, status reads `STANDBY`
- **Loading** → Glyph sequence cycling, "Acquiring Signal..." with blinking cursor

---

## 12. Sound Design (Optional Enhancement)

If audio is implemented, all sounds should evoke **the inside of a server room at 2AM**:

- **Hover**: Soft, dry click (mechanical relay)
- **Click**: Crisp keypress with minimal reverb
- **Module boot**: Quiet power-on hum, capacitor charge
- **Page transition**: Brief static burst resolving to silence
- **Ambient**: Ultra-low-frequency hum that shifts pitch subtly on navigation

All audio should be **opt-in**, triggered only after user interaction, and controllable via a visible mute toggle styled as a system control.

---

## 13. File Structure

```
/app
  /layout.tsx              — Root layout with noise background + scanline overlay
  /page.tsx                — Landing page
  /[routes]/page.tsx       — Additional pages

/components
  /ui
    Module.tsx             — Base module container
    DecodeText.tsx         — Character decode animation component
    SignalButton.tsx        — Button with mechanical states
    StatusBadge.tsx         — State indicator pill
    ProgressReadout.tsx     — Stepped progress bar
    DataValue.tsx           — Animated numeric display
    SystemNav.tsx           — Directory-style navigation
    TransmissionDivider.tsx — Glyph-based section divider
  /shaders
    NoiseBackground.tsx    — R3F noise floor component
    ScanlineOverlay.tsx    — CRT scan effect
    RGBFringe.tsx          — Text fringe effect
    DissolutionMask.tsx    — Pixel dissolution transition
  /glyphs
    GlyphField.tsx         — Glyph grid renderer
    GlyphBorder.tsx        — Animated glyph borders
    glyphSet.ts            — Glyph definitions and sprite data
    glyphAnimator.ts       — Cycle/resolve animation engine

/lib
  timing.ts                — Animation timing constants
  useBootSequence.ts       — Hook for module activation orchestration
  useDecodeText.ts         — Hook for text decode effect
  useScrollActivation.ts   — Intersection observer wrapper

/shaders
  noise.frag               — Noise floor fragment shader
  dissolution.frag         — Pixel dissolution fragment shader
  scanline.frag            — Scanline drift fragment shader

/styles
  globals.css              — CSS variables, base resets, background grid
  tailwind.config.ts       — Extended with Signal Decay design tokens

/public
  /fonts                   — Self-hosted typefaces
```

---

## 14. Performance Constraints

- **Shader layers must run at 60fps** on mid-range hardware. Keep fragment shader complexity low. Use `half` precision where possible.
- **Noise floor grain** can use a pre-rendered 256×256 noise texture translated each frame rather than computing noise per-pixel per-frame.
- **Glyph animations** should be canvas-rendered, not DOM-animated. Avoid animating hundreds of individual SVG/HTML elements.
- **Module boot sequences** should use `will-change: transform, opacity` and be GPU-composited.
- **Total JavaScript bundle** (excluding Three.js) should target <150KB gzipped.
- **Three.js** should be code-split and lazy-loaded — shader layers initialize after first paint.
- **Scanline and noise overlays** use `pointer-events: none` and `position: fixed` to avoid layout thrashing.

---

## 15. Accessibility

Despite the aesthetic's intensity, accessibility is non-negotiable:

- All decode animations must resolve to **fully legible, static text** within 1 second.
- Provide `prefers-reduced-motion` media query support: disable all ambient animation, decode effects, and shader overlays. Content appears instantly.
- Maintain **WCAG AA contrast** for all body text (phosphor white on void black exceeds this).
- Cyan-on-black meets AA for large text; verify small text sizes.
- Orange-on-black must meet AA — `#FF5A1F` on `#05080A` passes at 4.7:1.
- Navigation must be fully keyboard-accessible with visible focus indicators (block cursor style).
- All decorative elements (noise, scanlines, glyph fields) are `aria-hidden="true"`.
- Screen reader users experience clean, semantic content with no awareness of the visual effects layer.

---

*This document defines the Signal Decay design system. Every component, animation, and interaction should reinforce the core transmission metaphor: the user isn't browsing a website — they're intercepting a signal.*
