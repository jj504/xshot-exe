# Landing Page Specification — Execution Contracts for AI Pipelines

## Overview

A single-page marketing site. Four sections: Hero, How It Works, CTA, Footer. No navigation links beyond the footer. No product screenshots. No dashboard previews. The page IS the product demonstration — every animation mirrors the core metaphor of chaos resolving into contracted, predictable behavior.

The entire page should feel like it powered on when the user arrived, ran a diagnostic, and is presenting its findings.

---

## Global Page Elements

### Background

- **Void black** (`#05080A`) fills the entire viewport at all times
- **Dot matrix grid** visible across the full page background:
  ```css
  background-image: radial-gradient(circle, #1A2A2E 1px, transparent 1px);
  background-size: 24px 24px;
  ```
- Grid opacity shifts subtly per section (see per-section notes)

### Noise Floor

- Full-viewport GLSL noise shader overlay
- Grain contrast: ~3-5% luminosity variation
- Updates every frame (~60fps)
- `pointer-events: none`, `position: fixed`, `z-index: 9999`
- Barely perceptible — contributes to "the system is alive" feeling without being distracting

### Scanline Overlay

- Faint horizontal scan lines across full viewport
- ~2-3% opacity
- Slow vertical drift (8-second cycle)
- Purely atmospheric

### Scroll Behavior

- Each section triggers its boot sequence independently via Intersection Observer (threshold: 0.2)
- Once a section boots, it stays booted — no reverse animations on scroll-out
- Sections boot sequentially if user scrolls fast (no overlapping animations)

---

## Section 1: Hero

### Layout

- Full viewport height (100vh)
- Two-column on desktop: copy left (~55%), animation right (~45%)
- Stacked on mobile: copy on top, animation below
- Vertically centered content within the viewport
- No background changes from global (void black + dot grid at base opacity)

### Copy

#### Pre-headline
```
RX-00 / EXECUTION CONTRACTS FOR AI PIPELINES
```
- **Type:** Label (condensed sans, uppercase, wide letter-spacing)
- **Color:** `--signal-ghost` (`#1A2A2E`) → brightens to `--signal-cyan-60` on boot
- **Animation:** Types itself out character by character, left to right, with a blinking block cursor (`█`) that persists for 1 second after completion then disappears
- **Timing:** 15ms per character, starts immediately on page load
- **Total duration:** ~800ms

#### Headline
```
ship your pipeline.
stop babysitting it.
```
- **Type:** Display (ultra-heavy compressed grotesque, uppercase)
- **Size:** `clamp(2.5rem, 6vw, 5.5rem)`
- **Color:** `--phosphor-white` (`#E0F0F0`)
- **Line break:** Two lines as written. Period at end of each line.
- **Animation:** Full decode effect. Every character starts as a random glyph from the scramble set and cycles through 4-6 random characters before locking to the correct one. Characters resolve left-to-right with a 25ms stagger between each.
- **RGB fringe:** During the decode phase, characters display subtle chromatic aberration (1-2px red/cyan offset). Fringe settles to zero once character locks.
- **Timing:** Begins 200ms after pre-headline completes. Each character cycles for ~150ms before resolving. Full headline resolves in ~2.5 seconds.
- **Post-resolve state:** Clean, static text. No ongoing effects.

#### Subline
```
turn fragile notebooks, comfy workflows, and glue code into
typed, linear pipelines with retries, fallbacks, and a stable api.
deploy once. behavior is predictable. failures are explainable.
```
- **Type:** System mono (JetBrains Mono or similar)
- **Size:** `--text-system-lg` (1.125rem)
- **Color:** `--phosphor-white` (`#E0F0F0`)
- **Line breaks:** Three lines as written
- **Animation:** Each line appears sequentially with a fast decode sweep — characters resolve in a quick left-to-right wave (~500ms per line). Much subtler than the headline treatment.
- **Timing:** First line begins 300ms after headline completes. 200ms gap between each subsequent line.
- **Total duration:** ~2 seconds for all three lines

#### CTA Button
```
request access
```
- **Type:** System mono, uppercase, wide letter-spacing
- **Color:** `--interference-orange` (`#FF5A1F`) border and text
- **Shape:** Pill / rounded rectangle, 1px border
- **Hover state:** Background fills `--interference-orange`, text inverts to `--void-black`. Instant snap, no transition.
- **Animation:** Snaps into existence (opacity 0 → 1, no fade) 200ms after subline completes. A brief single-frame flash of the border on appearance.
- **Note:** This is the ONLY orange element visible on the entire page until the CTA section.

### Hero Animation — "The Signal Lock"

This is the primary visual element of the hero. It sits to the right of the copy on desktop, below the copy on mobile.

#### Container
- A large Module component with:
  - Corner registration marks (L-brackets at each corner)
  - Module ID top-left: `SYS-00`
  - Status indicator top-right: starts as `RECEIVING...` (blinking), changes to `LOCKED` once resolved
  - Border: 1px `--signal-ghost`, brightens to `--signal-cyan-60` once animation completes
- Size: roughly 500×400px on desktop, full-width on mobile
- Background: `--void-black` (slightly darker than page if possible, to create depth)

#### Animation Sequence

**Phase 1 — Noise (0-1.5s after section boot)**

The interior of the module is filled with a character grid — approximately 40 columns × 20 rows of monospaced characters. Characters are randomly selected from:

```
Scramble set: ░ ▒ ▓ █ ┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ╔ ╗ ╚ ╝ ═ ║ ◆ ◇ ● ○ ■ □ ▸ ▾ ╳ ⊕ ⊗ / \ | : ; . , * # @ ! ? > < { } [ ] 0 1
```

- Characters cycle rapidly (new random character every 60ms per cell)
- Color: `--signal-cyan-100` at ~40% opacity (dim, noisy)
- The grid should feel like raw, unprocessed data being received

**Phase 2 — Resolve (1.5s-4s)**

Characters begin locking into their final positions. The resolve pattern spreads outward from the center of the grid in an organic, wave-like pattern (not strictly left-to-right).

As characters lock, they brighten from 40% to 100% opacity and stop cycling.

The final resolved state reveals an ASCII-art pipeline diagram:

```
  ┌──────────────┐
  │  INPUT        │
  │  img 1024²    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  STEP-01      │
  │  upscale      │─── on_err → [FALLBACK]
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  STEP-02      │
  │  style_tfr    │─── retry: 3x
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  OUTPUT       │
  │  png 4096²    │
  └──────────────┘

  STATUS: CONTRACTED ■
  v2.1.3 — POST /v1/rx-0847
```

- All box-drawing characters, arrows, and labels are rendered in monospaced type
- Pipeline steps are `--signal-cyan-100`
- `on_err` and `retry` annotations are `--phosphor-dim` (`#B0C4C4`)
- `STATUS: CONTRACTED` is `--signal-cyan-100` with the `■` block solid
- The API endpoint line is `--phosphor-dim`

**Phase 3 — Ambient (4s onward, loops indefinitely)**

The diagram is now stable but alive:
- `STATUS: CONTRACTED` has a blinking block cursor at the end (1s on, 1s off)
- `retry: 3x` flickers briefly every 8 seconds (characters scramble for 2 frames then re-resolve)
- Every 10-12 seconds, a subtle wave of noise ripples across the entire grid — ~5% of characters briefly scramble then lock back. Like momentary interference. Takes ~300ms.
- Step progress bars (if space permits) show a subtle pulse animation

#### Implementation Notes
- Render the character grid on a `<canvas>` element for performance (not individual DOM elements)
- Each cell in the grid has: character, target character, resolved (boolean), opacity, cycle timer
- The resolve wave can be implemented as a distance-from-center calculation with a time threshold
- Pre-calculate the final ASCII art as a 2D character array so the resolve animation has a clear target

---

## Section 2: How It Works — "Pipeline Contraction"

### Layout

- Section height: auto (content-driven), minimum ~80vh
- Section label top-left
- Two-panel comparison (left/right on desktop, stacked on mobile)
- Glyph divider between panels (vertical on desktop, horizontal on mobile)
- Copy block below the two panels
- Top margin from hero: 80-120px

### Section Label
```
RX-01 / PIPELINE CONTRACTION
```
- **Type:** Label
- **Color:** `--signal-ghost` → `--signal-cyan-60` on section boot
- **Animation:** Types out with cursor (same as hero pre-headline treatment)
- **Timing:** Triggers on scroll into view

### Background Shift

- The dot matrix grid opacity increases slightly in this section (~1.5x base opacity)
- Creates a subtle sense of entering a different zone without a hard visual break

### Left Panel — "BEFORE"

#### Container
- Module component
- Module ID: `DIAG-00`
- Status badge: `FRAGILE` in `--interference-orange` (the second use of orange on the page — deliberate)
- Border: `--signal-ghost`
- Background: `--void-black`

#### Boot Sequence (triggered on scroll)
1. Module border draws itself corner-to-corner (200ms)
2. Module ID decodes (150ms)
3. Status badge snaps to orange (instant)
4. Interior content begins

#### Interior Content — Simulated Error Log

A terminal-style scrolling log. Text appears line by line, then the block loops on a slow scroll.

```
[03:12:41] retry 4/5... model timeout (flux-dev)
[03:12:44] fallback not configured. exiting.
[03:12:44] ERROR: pipeline failed at step 3
[03:12:45] restart? check glue.py line 247
[03:13:01] WARN: comfy node "upscale_v2" not found
[03:13:01] did you mean "upscale_v2_fixed_final"?
[03:13:15] cost so far: $4.82 (expected: $0.60)
[03:13:15] no rollback available
[03:13:16] ¯\_(ツ)_/¯
[03:14:02] restarting pipeline from step 1...
[03:14:03] WARN: model weights changed since last run
[03:14:03] behavior may differ from previous execution
[03:14:30] step 2 returned unexpected shape (512, 512, 4)
[03:14:30] expected (1024, 1024, 3)
[03:14:31] pipeline aborted.
[03:15:00] ...you are still awake for this?
```

- **Type:** System mono, small (`--text-system-sm`, 0.8125rem)
- **Color:** Default lines in `--phosphor-dim`. `ERROR` lines in `--interference-orange`. `WARN` lines in `--signal-cyan-60`. Timestamps in `--signal-ghost`.
- **Animation:** Lines appear one at a time (200ms between lines). Once all lines have appeared, the log slowly scrolls upward on a continuous loop. Occasional individual characters in random lines briefly glitch (scramble for 1-2 frames) — the signal degradation effect.
- **Overflow:** Container has a fixed height with `overflow: hidden`. Log content is taller than container, creating the scroll effect.

### Center Divider — Glyph Transmission Line

- Vertical line on desktop (full height of the panels), horizontal on mobile
- Built from custom glyph characters that cycle slowly through the glyph set
- In the vertical center of the divider: a single arrow `▸` (desktop) or `▾` (mobile)
- Arrow pulses in `--signal-cyan-100` (opacity oscillates between 60% and 100% on a 2-second cycle)
- The divider communicates: the left transforms into the right

### Right Panel — "AFTER"

#### Container
- Module component
- Module ID: `DIAG-01`
- Status badge: `CONTRACTED` in `--signal-cyan-100`
- Border: `--signal-cyan-60` (brighter than the left panel — this one is healthy)
- Background: `--void-black`

#### Boot Sequence (triggered 400ms after left panel boots)
1. Border draws itself (200ms)
2. Module ID decodes (150ms)
3. Status badge decodes to `CONTRACTED` (200ms)
4. Interior content populates

#### Interior Content — Pipeline Status Readout

A clean, formatted status display. All character-rendered, monospaced.

```
PIPELINE   rx-0847
VERSION    v2.1.3
STEPS      3/3 nominal


STEP-01    upscale       ████████████  OK       12ms
STEP-02    style_tfr     ████████████  OK      847ms
STEP-03    output        ████████████  OK        3ms


RETRIES    0 triggered
FALLBACKS  0 triggered
COST       $0.58 / $0.60 limit


ENDPOINT   POST /v1/rx-0847
UPTIME     ■■■■■■■■■■■■■■■■■■■■  100%
```

- **Type:** System mono (`--text-system-sm`)
- **Color scheme:**
  - Labels (PIPELINE, VERSION, etc.): `--phosphor-dim`
  - Values (rx-0847, v2.1.3, etc.): `--signal-cyan-100`
  - Progress bars (████): `--signal-cyan-100`
  - `OK` status: `--signal-cyan-100`
  - Timing values: `--phosphor-dim`
  - Cost value: `--signal-cyan-100` (turns `--interference-orange` if over limit — but in this demo it's under)
  - Uptime blocks (■): `--signal-cyan-100`

- **Animation:**
  - Each line appears with a fast decode sweep (characters resolve left-to-right, 300ms per line)
  - Lines appear sequentially with 80ms stagger
  - Progress bars fill character by character (each `█` block appears with 30ms stagger)
  - `OK` statuses snap in after their progress bar completes
  - Timing values count up from 0 to their final value in stepped increments (16ms per step)
  - Cost value counts up: `$0.00` → `$0.58` in stepped increments
  - Uptime blocks fill left to right (40ms per block)

- **Post-animation ambient state:**
  - Timing values occasionally refresh with a single-frame decode flicker (one value updates every 5-6 seconds)
  - Uptime counter stays solid
  - The whole panel feels "live" without being busy

### Copy Below Panels

Positioned below both panels, centered, with generous top margin (48-64px).

```
notebooks, scripts, comfy workflows, jupyter, glue code.
whatever you have, contract it into a linear typed pipeline.
retries, fallbacks, cost limits, versioned api. handled.
```

- **Type:** System mono, `--text-system-lg`
- **Color:** `--phosphor-white`
- **Animation:** Each line does a fast decode sweep (500ms per line), staggered 150ms apart. Triggers after both panels have completed their boot sequences.
- **Alignment:** Left-aligned on desktop, left-aligned on mobile
- **Line breaks:** Three lines as written. Each line is its own element for stagger control.

---

## Section 3: CTA — "Open Channel"

### Layout

- Full viewport height (100vh), content vertically centered
- Single centered module
- Top margin from Section 2: 80-120px minimum

### Background Shift

- Dot matrix grid brightens to ~2x base opacity
- Noise floor grain increases subtly (~5% → ~7% variation)
- The system is "powering up" — the environment responds to the approaching decision point
- This shift should be gradual (tied to scroll position as the section enters viewport)

### Section Label
```
TX-00 / OPEN CHANNEL
```
- **Type:** Label
- **Color:** `--signal-ghost` → `--signal-cyan-60`
- **Animation:** Types out with cursor
- **Note:** This is the first section prefixed `TX` (transmit) instead of `RX` (receive). Subtle signal that the user is now the one sending.

### CTA Module

A single large module, centered horizontally, max-width ~700px.

#### Container
- Module ID: `TX-00`
- Status indicator: none (or a small blinking transmission icon `◆`)
- Border: `--signal-ghost` → draws itself on boot → settles at `--signal-cyan-60`
- Corner registration marks: standard
- Internal padding: generous (32-48px)

#### Boot Sequence
1. Border draws corner-to-corner (300ms — slightly slower than other modules, more deliberate)
2. Module ID decodes (150ms)
3. Internal content decodes (see below)

#### Interior Content

**Headline:**
```
you have a pipeline that works
until it doesn't.
```
- **Type:** Display, but slightly smaller than hero (`clamp(1.8rem, 4vw, 3rem)`)
- **Color:** `--phosphor-white`
- **Animation:** Full decode effect with character scramble (same treatment as hero headline but faster, ~1.5s total)
- **Line break:** Two lines as written

**Tagline (below headline, after 300ms pause):**
```
we make it boring.
```
- **Type:** Display, LARGE — same size or larger than hero headline (`clamp(2.5rem, 6vw, 5.5rem)`)
- **Color:** `--signal-cyan-100`
- **Animation:** Full decode effect. This is the emotional climax — the decode should be slightly more dramatic. Characters cycle through more iterations before resolving. RGB fringe effect active during decode.
- **Timing:** 2-3 seconds to fully resolve
- **Post-resolve:** Static, bright, dominant. This line should feel like it lands with weight.

**CTA Button (below tagline, after 200ms pause):**
```
request access
```
- **Type:** System mono, uppercase, wide letter-spacing
- **Size:** Larger than the hero CTA (more padding, slightly bigger text)
- **Color:** `--interference-orange` border and text
- **Hover:** Background fills orange, text inverts to void-black (instant snap)
- **Animation:** Border draws itself (200ms), then text decodes inside (300ms)
- **Note:** This is now the LARGEST and most prominent orange element on the page

**Sub-label (below button, after 100ms):**
```
currently onboarding by invite
```
- **Type:** Label, small
- **Color:** `--signal-ghost`
- **Animation:** Fades in (one of the few true fades on the page — appropriate for whispered information)

---

## Section 4: Footer

### Layout

- Thin horizontal bar, not a full section
- Fixed height: ~80px
- Three-column layout: left / center / right
- Top border: 1px `--signal-ghost`
- Background: `--void-black` (same as page)

### Content

**Left:**
```
[PRODUCT NAME]
```
- Product name or logo mark in label type
- `--phosphor-dim`
- Accompanied by a small glyph mark (from the custom glyph set) if available

**Center:**
```
SYS NOMINAL · UPTIME 100% · LATENCY 42ms
```
- **Type:** Label, small
- **Color:** `--signal-cyan-60`
- **Animation:** Values occasionally refresh with decode flicker (one value updates every 6-8 seconds). Latency might fluctuate between 38-47ms. Uptime stays at 100%.
- **The `·` separators** are `--signal-ghost`

**Right:**
```
DOCS    CHANGELOG    CONTACT
```
- **Type:** Label, small, uppercase, wide letter-spacing
- **Color:** `--phosphor-dim`, hover → `--signal-cyan-100`
- **Spacing:** Large gaps between items (32-48px)
- These are real links (even if they go to placeholder pages)

**Bottom line (below the three columns, very small, centered):**
```
© 2026 — all transmissions monitored
```
- **Type:** Label, extra small
- **Color:** `--signal-ghost` at ~60% opacity (barely visible)
- This is a brand voice easter egg, not functional copy

---

## Animation Timing Master Sequence

This is the full orchestration of what happens when a user loads the page and scrolls through it.

### On Page Load (Hero is immediately visible)

```
T+0ms       Page renders. Noise floor and scanlines active. Dot grid visible.
T+0ms       Hero character grid begins cycling (Phase 1 — noise)
T+100ms     Pre-headline begins typing: "RX-00 / EXECUTION CONTRACTS..."
T+900ms     Pre-headline complete. Cursor blinks for 500ms.
T+1400ms    Headline begins decode: "ship your pipeline..."
T+1500ms    Character grid begins resolve (Phase 2 — spreading from center)
T+3900ms    Headline fully resolved. RGB fringe settles.
T+4000ms    Character grid fully resolved. Status flips to "LOCKED"
T+4200ms    Subline line 1 begins decode sweep
T+4700ms    Subline line 1 complete. Line 2 begins.
T+5200ms    Subline line 2 complete. Line 3 begins.
T+5700ms    Subline line 3 complete.
T+5900ms    CTA button snaps in (instant opacity change + border flash)
T+6000ms    Hero fully booted. Ambient animations begin (grid interference, cursor blink)
```

### On Scroll to Section 2

```
T+0ms       Section label begins typing: "RX-01 / PIPELINE CONTRACTION"
T+200ms     Left panel (BEFORE) border begins drawing
T+400ms     Left panel module ID decodes
T+500ms     Left panel status badge ("FRAGILE") snaps to orange
T+600ms     Error log lines begin appearing (200ms between each)
T+600ms     Right panel border begins drawing (400ms after left panel start)
T+800ms     Right panel module ID decodes
T+900ms     Right panel status badge ("CONTRACTED") decodes
T+1000ms    Right panel status readout begins populating (line by line, 80ms stagger)
T+1000ms    Glyph divider begins cycling
T+3500ms    Both panels fully populated
T+4000ms    Copy below panels begins decode (3 lines, 500ms each, 150ms stagger)
T+5500ms    Section fully booted. Ambient state begins (log scrolling, value flickering)
```

### On Scroll to Section 3

```
T+0ms       Background shift begins (grid brightens, noise increases)
T+100ms     Section label types: "TX-00 / OPEN CHANNEL"
T+500ms     CTA module border begins drawing (slower — 300ms)
T+800ms     Module ID decodes
T+1000ms    Headline begins decode: "you have a pipeline that works..."
T+2500ms    Headline resolved
T+2800ms    Tagline begins decode: "we make it boring."
T+4800ms    Tagline resolved. Bright cyan, dominant.
T+5000ms    CTA button border draws, text decodes inside
T+5500ms    Sub-label fades in
T+5700ms    Section fully booted.
```

---

## Decode Animation Specification

Since the character decode effect is used throughout the page, here is the canonical specification.

### Parameters

```typescript
interface DecodeConfig {
  text: string;                    // Target text to resolve to
  scrambleSet: string;             // Characters to cycle through during decode
  charCycleDuration: number;       // How long each character cycles before resolving (ms)
  charCycleFrameRate: number;      // How often the cycling character changes (ms)
  staggerDelay: number;            // Delay between sequential character resolve starts (ms)
  rgbFringe: boolean;              // Whether to apply chromatic aberration during decode
  fringeOffset: number;            // Pixel offset for RGB fringe (typically 1-2)
  onResolve?: () => void;          // Callback when fully resolved
}
```

### Default Presets

```typescript
const DECODE_PRESETS = {
  // Full theatrical decode — for headlines and key moments
  headline: {
    charCycleDuration: 150,
    charCycleFrameRate: 60,
    staggerDelay: 25,
    rgbFringe: true,
    fringeOffset: 1.5,
  },

  // Fast sweep — for body copy and secondary text
  body: {
    charCycleDuration: 80,
    charCycleFrameRate: 40,
    staggerDelay: 10,
    rgbFringe: false,
    fringeOffset: 0,
  },

  // Typewriter — for labels and section IDs
  label: {
    charCycleDuration: 0,      // No cycling, just appears
    charCycleFrameRate: 0,
    staggerDelay: 15,          // Character-by-character typing
    rgbFringe: false,
    fringeOffset: 0,
  },

  // Dramatic — for the "we make it boring." tagline
  dramatic: {
    charCycleDuration: 250,
    charCycleFrameRate: 50,
    staggerDelay: 35,
    rgbFringe: true,
    fringeOffset: 2,
  },

  // Flicker — for ambient value refreshes
  flicker: {
    charCycleDuration: 40,
    charCycleFrameRate: 30,
    staggerDelay: 0,           // All characters simultaneously
    rgbFringe: false,
    fringeOffset: 0,
  },
} as const;
```

### Default Scramble Set

```typescript
const SCRAMBLE_CHARS = '░▒▓█┌┐└┘─│┬┴├┤┼◆◇●○■□▸▾╳⊕⊗/:;.,*#@!?><{}[]01';
```

---

## Character Grid (Hero) Specification

### Grid Properties

```typescript
interface CharGridConfig {
  cols: number;             // ~40 on desktop, ~28 on mobile
  rows: number;             // ~20 on desktop, ~16 on mobile
  cellWidth: number;        // Width per character cell in pixels
  cellHeight: number;       // Height per character cell in pixels (typically 1.4x width)
  font: string;             // Monospace font matching system type
  fontSize: number;         // Typically 12-14px
  scrambleSet: string;      // Same as decode scramble set
  targetArt: string[][];    // 2D array of final resolved characters
  resolvePattern: 'center-out' | 'left-right' | 'random';
  resolveSpeed: number;     // ms for the resolve wave to cross the full grid
  ambientNoiseInterval: number;  // ms between ambient interference ripples
  ambientNoisePercent: number;   // % of cells affected per ripple (~5%)
}
```

### Render Approach

- Use `<canvas>` element
- Each cell is drawn via `ctx.fillText()`
- Color per cell: dim cyan during noise phase, bright cyan when resolved
- The resolve wave is calculated per-frame: any cell whose distance from center is less than `(currentTime - resolveStart) * speed` gets resolved
- Ambient noise: every `ambientNoiseInterval` ms, randomly select `ambientNoisePercent` of resolved cells, briefly unresolved them for 2-3 frames, then re-resolve

### ASCII Art Target

The final resolved state. Spaces are preserved. The grid should be sized so this content is centered with margin on all sides.

```
                                            
   ┌──────────────┐                         
   │  INPUT        │                         
   │  img 1024²    │                         
   └──────┬───────┘                         
          │                                  
          ▼                                  
   ┌──────────────┐                         
   │  STEP-01      │                         
   │  upscale      │── on_err → [FALLBACK]  
   └──────┬───────┘                         
          │                                  
          ▼                                  
   ┌──────────────┐                         
   │  STEP-02      │                         
   │  style_tfr    │── retry: 3x            
   └──────┬───────┘                         
          │                                  
          ▼                                  
   ┌──────────────┐                         
   │  OUTPUT       │                         
   │  png 4096²    │                         
   └──────────────┘                         
                                            
   STATUS: CONTRACTED ■                      
   v2.1.3 — POST /v1/rx-0847               
```

---

## Responsive Behavior

### Desktop (>1024px)

- Hero: two-column (copy left, grid right)
- Section 2: two panels side by side with vertical glyph divider
- Section 3: centered module, comfortable width (~700px max)
- Footer: three-column

### Tablet (768-1024px)

- Hero: two-column with tighter proportions
- Section 2: panels stack vertically, glyph divider becomes horizontal
- Section 3: module stretches wider
- Footer: three-column compressed

### Mobile (<768px)

- Hero: single column, copy above, character grid below (grid scales down — fewer cols/rows)
- Section 2: panels stack vertically, horizontal glyph divider between them
- Section 3: module full-width with padding
- Footer: stacks to two rows (left+center top, links bottom)
- All decode animations run faster (reduce stagger delays by ~40%)
- Character grid reduces to ~28×14

### Reduced Motion (`prefers-reduced-motion: reduce`)

- ALL decode animations disabled — text appears instantly
- Character grid shows final resolved state immediately (no noise phase)
- Error log shows all lines at once (no sequential appearance), scrolls without glitch effects
- Status readout shows final values immediately (no count-up)
- Noise floor, scanlines, and ambient flickers disabled
- Glyph divider shows static characters (no cycling)
- Background grid and module borders appear without draw animations
- Page becomes a clean, static dark-theme layout with all content visible

---

## Color Quick Reference

| Token | Hex | Usage |
|---|---|---|
| `--void-black` | `#05080A` | Page background, module backgrounds |
| `--signal-cyan-100` | `#00F0FF` | Headlines, active states, key data, progress bars |
| `--signal-cyan-60` | `#00F0FF99` | Secondary elements, module borders (active), labels |
| `--signal-cyan-15` | `#00F0FF26` | Atmospheric glow |
| `--signal-cyan-05` | `#00F0FF0D` | Ghost grid lines |
| `--interference-orange` | `#FF5A1F` | CTAs, error states, FRAGILE badge. Orange is an event. |
| `--phosphor-white` | `#E0F0F0` | Body text, headlines (resolved state) |
| `--phosphor-dim` | `#B0C4C4` | Secondary text, timestamps, annotations |
| `--signal-ghost` | `#1A2A2E` | Borders (inactive), grid dots, barely-visible structure |

---

## Typography Quick Reference

| Role | Font | Weight | Size | Transform | Spacing |
|---|---|---|---|---|---|
| Display | Druk Wide / compressed grotesque | Black/Heavy | `clamp(2.5rem, 6vw, 5.5rem)` | Uppercase | Normal |
| System | JetBrains Mono / precision mono | Regular | 0.8125-1.125rem | None | Normal |
| Label | DIN Condensed / condensed sans | Medium | 0.6875rem | Uppercase | 0.08em+ |

---

## Implementation Priority

Build order recommendation:

1. **Global shell** — void background, dot grid, noise shader, scanline overlay
2. **Module component** — border draw animation, registration marks, ID, status badge
3. **Decode text component** — all presets (headline, body, label, dramatic, flicker)
4. **Hero section** — copy + character grid canvas
5. **Section 2** — before/after panels with terminal log and status readout
6. **Section 3** — CTA module
7. **Footer**
8. **Scroll orchestration** — intersection observers, timing coordination
9. **Responsive** — breakpoint adjustments, mobile grid scaling
10. **Reduced motion** — `prefers-reduced-motion` fallbacks
11. **Performance** — lazy-load Three.js/shaders, optimize canvas rendering, verify 60fps on mid-range hardware

---

*This document is the complete specification for the landing page. Every animation, every color, every timing value is defined. Build to spec.*
