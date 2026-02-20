export const TIMING = {
  INSTANT: 0,
  CHAR_STAGGER: 20,
  GLYPH_CYCLE: 60,
  MODULE_BORDER_DRAW: 200,
  MODULE_BOOT_TOTAL: 800,
  VALUE_COUNT_STEP: 16,
  SCAN_DRIFT_PERIOD: 8000,
  NOISE_FRAME: 16,
} as const;

export const SCRAMBLE_CHARS = "\u2591\u2592\u2593\u2588\u250C\u2510\u2514\u2518\u2500\u2502\u252C\u2534\u251C\u2524\u253C\u25C6\u25C7\u25CF\u25CB\u25A0\u25A1\u25B8\u25BE\u2573\u2295\u2297/:;.,*#@!?><{}[]01";

export const DECODE_PRESETS = {
  headline: { charCycleDuration: 150, charCycleFrameRate: 60, staggerDelay: 25, rgbFringe: true, fringeOffset: 1.5 },
  body: { charCycleDuration: 80, charCycleFrameRate: 40, staggerDelay: 10, rgbFringe: false, fringeOffset: 0 },
  label: { charCycleDuration: 0, charCycleFrameRate: 0, staggerDelay: 15, rgbFringe: false, fringeOffset: 0 },
  dramatic: { charCycleDuration: 250, charCycleFrameRate: 50, staggerDelay: 35, rgbFringe: true, fringeOffset: 2 },
  flicker: { charCycleDuration: 40, charCycleFrameRate: 30, staggerDelay: 0, rgbFringe: false, fringeOffset: 0 },
} as const;

// Mobile presets: 40% faster stagger
export const DECODE_PRESETS_MOBILE = {
  headline: { ...DECODE_PRESETS.headline, staggerDelay: 15, charCycleDuration: 90 },
  body: { ...DECODE_PRESETS.body, staggerDelay: 6, charCycleDuration: 50 },
  label: { ...DECODE_PRESETS.label, staggerDelay: 9 },
  dramatic: { ...DECODE_PRESETS.dramatic, staggerDelay: 21, charCycleDuration: 150 },
  flicker: { ...DECODE_PRESETS.flicker },
} as const;

export type DecodePreset = keyof typeof DECODE_PRESETS;
