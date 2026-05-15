/**
 * Saigon Neon — visual language
 * Cyberpunk Edgerunners meets Vietnamese cultural motifs.
 * Deep night base, neon accents drawn from áo dài silk, jade, lotus, and gold.
 */

export const colors = {
  // Base — deep saigon night
  bgDeep: '#05030d',
  bgBase: '#0a0612',
  bgRaised: '#13091f',
  bgCard: '#1a0f2b',
  bgInset: '#241438',

  // Neon primaries
  neonPink: '#ff2ea6',       // hot lotus
  neonCyan: '#22e6ff',       // saigon rain
  neonJade: '#3df5b0',       // jade dragon
  neonGold: '#ffcb47',       // imperial gold
  neonRed: '#ff3b5c',         // áo dài silk red
  neonViolet: '#a14bff',      // night market

  // Text
  textBright: '#f6f0ff',
  text: '#d9cfe8',
  textMuted: '#8c7fa6',
  textDim: '#5b4f73',

  // States
  success: '#3df5b0',
  warn: '#ffcb47',
  danger: '#ff3b5c',

  // Overlays
  scrim: 'rgba(5, 3, 13, 0.72)',
  glassBorder: 'rgba(255, 46, 166, 0.35)',
  glassBorderSoft: 'rgba(34, 230, 255, 0.22)',
};

export const gradients = {
  saigonSky: ['#0a0612', '#1a0f2b', '#2a0a3f'] as const,
  lotusGlow: ['#ff2ea6', '#a14bff'] as const,
  jadeRain: ['#22e6ff', '#3df5b0'] as const,
  imperial: ['#ffcb47', '#ff3b5c'] as const,
  nightMarket: ['#13091f', '#3a0d52'] as const,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const font = {
  display: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  vietnameseBig: {
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
};

export const glow = (color: string, intensity: number = 1) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9 * intensity,
  shadowRadius: 14 * intensity,
  elevation: 12,
});
