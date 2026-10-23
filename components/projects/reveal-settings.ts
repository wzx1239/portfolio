// Production Reveal Field. Values are independent of the development lab.
export const revealSettings = {
  radiusRatio: .30,
  minRadius: 72,
  maxRadius: 210,
  softness: .66, // 0 = tighter edge, 1 = very soft
  distortionStrength: 1.8, // maximum image displacement in px
  strength: 1.5, // residual Trace → Reveal opacity; one coherent monochrome mask
  traceWidth: .7, // scale the shared Trace half-width for project media
  restingSaturation: .48,
  restingContrast: .94,
  restingBrightness: .97,
  transitionSpeed: 85, // pointer/field response time in ms
  hoverActivationDelay: 380, // preserve a local discovery phase
  activationDuration: 650,
  videoTransitionSpeed: 360,
  scrollTravel: 7, // secondary motion only; px
} as const;
