// Shared production Trace controls. No cursor replacement, particles or UI text.
export const traceSettings = {
  intensity: .78,
  decay: 1400,                 // ms at normal speed
  fastDecay: 2000,             // ms at fast speed
  size: 82,                   // half-width in CSS px; irregular influence ~100–250px
  velocitySensitivity: 1.35,  // px/ms for full response; lower = more sensitive
  stretch: .65,
  refraction: 13,             // CSS px of background/grain displacement
  tonalStrength: .016,       // signed material tonal disturbance; never a light/glow
  darkPageColour: [.65, .65, .65], // restrained light grey
  lightPageColour: [.38, .38, .38], // restrained dark grey
  diffusion: .32,            // soft widening during recovery
  inertia: 12,               // maximum drift in CSS px after passage
  maxTraces: 40,              // connected segments, bounded; ~2s of motion history
  sampleInterval: 48,
  maxFPS: 30,
  renderScale: .65,
  maxPixels: 750000,
  projectIntensity: .28,
  mediaIntensity: .04,
  paperTilt: .28,             // degrees, independent of scroll opening transform
  revealRecovery: 220,
  shape: [.17, .11, .06],     // harmonics shared by the shader and Reveal SVG
} as const;
