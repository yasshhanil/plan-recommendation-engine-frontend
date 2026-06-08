import { createTamagui } from '@tamagui/core'

const config = createTamagui({
  tokens: {
    color: {
      mainBackground: '#0B0B0F',
      elevatedSurface: '#15161B',
      cardSurface: '#1C1E24',
      inputSurface: '#23262F',
      primaryAccent: '#7C5CFF',
      secondaryAccent: '#A88BFF',
      success: '#4ADE80',
      warning: '#FACC15',
      error: '#FB7185',
      textPrimary: '#FFFFFF',
      textSecondary: '#B7BCC7',
      textMuted: '#7D8594',
      textDisabled: '#5A6270',
    },
    space: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },
    fontSize: {
      hero: 34,
      mainHeading: 28,
      sectionHeading: 22,
      cardTitle: 18,
      body: 15,
      smallLabel: 13,
      metadata: 12,
    },
    radius: {
      button: 18,
      card: 24,
      input: 18,
      bottomSheet: 32,
      pill: 999,
    },
  },
  fonts: {
    heading: {
      family: 'System',
      size: {
        small: 13,
        medium: 15,
        large: 18,
      },
      lineHeight: {
        small: 18,
        medium: 20,
        large: 24,
      },
      weight: {
        normal: '400',
        bold: '700',
      },
    },
    body: {
      family: 'System',
      size: {
        small: 13,
        medium: 15,
        large: 18,
      },
      lineHeight: {
        small: 18,
        medium: 20,
        large: 24,
      },
      weight: {
        normal: '400',
        bold: '700',
      },
    },
  },
  shorthands: {},
  themes: {
    dark: {
      background: '#0B0B0F',
      color: '#FFFFFF',
    },
  },
})

export type AppConfig = typeof config
export default config
