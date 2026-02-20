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

export const SCRAMBLE_CHARS = String.raw`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?><{}[]/:;.,`;

export const DECODE_PRESETS = {
  headline: { charCycleDuration: 150, charCycleFrameRate: 60, staggerDelay: 25, rgbFringe: true, fringeOffset: 1.5 },
  body: { charCycleDuration: 80, charCycleFrameRate: 40, staggerDelay: 10, rgbFringe: false, fringeOffset: 0 },
  label: { charCycleDuration: 0, charCycleFrameRate: 0, staggerDelay: 15, rgbFringe: false, fringeOffset: 0 },
  dramatic: { charCycleDuration: 250, charCycleFrameRate: 50, staggerDelay: 35, rgbFringe: true, fringeOffset: 2 },
  flicker: { charCycleDuration: 40, charCycleFrameRate: 30, staggerDelay: 0, rgbFringe: false, fringeOffset: 0 },
} as const;

export type DecodePreset = keyof typeof DECODE_PRESETS;
