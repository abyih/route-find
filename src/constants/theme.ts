/**
 * Design system for Addis Ababa Route Finder
 *
 * Color palette inspired by Ethiopian landscapes:
 *   Primary blue = trust/reliability for transit
 *   Amber accent = Ethiopian gold
 *   Transport-specific colors for bus vs taxi
 *
 * Builds a custom MD3 theme for React Native Paper v5.
 */

import { Platform } from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
} from 'react-native-paper';

export const Colors = {
  light: {
    text: '#1A1C1E',
    textSecondary: '#60646C',
    background: '#F8F9FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8ECEF',
    card: '#FFFFFF',
    border: '#E2E5EA',
    primary: '#1A73E8',
    primaryDark: '#0D47A1',
    primaryLight: '#E3F0FF',
    accent: '#FF8F00',
    accentLight: '#FFF3E0',
    success: '#2E7D32',
    successLight: '#E8F5E9',
    error: '#D32F2F',
    bus: '#2196F3',
    busLight: '#E3F2FD',
    taxi: '#FF9800',
    taxiLight: '#FFF3E0',
    gradient1: '#1A73E8',
    gradient2: '#0D47A1',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#E8ECEF',
    textSecondary: '#9BA1A8',
    background: '#0E1117',
    backgroundElement: '#1A1D23',
    backgroundSelected: '#272B33',
    card: '#1A1D23',
    border: '#2D3139',
    primary: '#4DA3FF',
    primaryDark: '#1A73E8',
    primaryLight: '#0D253F',
    accent: '#FFB74D',
    accentLight: '#2D2210',
    success: '#66BB6A',
    successLight: '#1B2E1C',
    error: '#EF5350',
    bus: '#64B5F6',
    busLight: '#0D253F',
    taxi: '#FFB74D',
    taxiLight: '#2D2210',
    gradient1: '#1A73E8',
    gradient2: '#4DA3FF',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Custom colors added to the Paper theme for transport-specific styling */
export type AppCustomColors = {
  bus: string;
  busLight: string;
  taxi: string;
  taxiLight: string;
  accent: string;
  accentLight: string;
  success: string;
  successLight: string;
  textSecondary: string;
  card: string;
  border: string;
  primaryLight: string;
  gradient1: string;
  gradient2: string;
};

export type AppTheme = MD3Theme & { colors: MD3Theme['colors'] & AppCustomColors };

export function getPaperTheme(scheme: 'light' | 'dark'): AppTheme {
  const palette = Colors[scheme];
  const baseTheme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: palette.primary,
      onPrimary: '#FFFFFF',
      primaryContainer: palette.primaryLight,
      onPrimaryContainer: palette.primary,
      secondary: palette.accent,
      onSecondary: '#FFFFFF',
      secondaryContainer: palette.accentLight,
      onSecondaryContainer: palette.accent,
      tertiary: palette.success,
      onTertiary: '#FFFFFF',
      tertiaryContainer: palette.successLight,
      onTertiaryContainer: palette.success,
      error: palette.error,
      background: palette.background,
      onBackground: palette.text,
      surface: palette.card,
      onSurface: palette.text,
      surfaceVariant: palette.backgroundElement,
      onSurfaceVariant: palette.textSecondary,
      outline: palette.border,
      outlineVariant: palette.border,
      elevation: {
        ...baseTheme.colors.elevation,
        level0: palette.background,
        level1: palette.card,
        level2: palette.backgroundElement,
        level3: palette.backgroundSelected,
        level4: palette.backgroundSelected,
        level5: palette.backgroundSelected,
      },
      // Custom app colors
      bus: palette.bus,
      busLight: palette.busLight,
      taxi: palette.taxi,
      taxiLight: palette.taxiLight,
      accent: palette.accent,
      accentLight: palette.accentLight,
      success: palette.success,
      successLight: palette.successLight,
      textSecondary: palette.textSecondary,
      card: palette.card,
      border: palette.border,
      primaryLight: palette.primaryLight,
      gradient1: palette.gradient1,
      gradient2: palette.gradient2,
    },
  };
}

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
