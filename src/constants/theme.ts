/**
 * Design system for Addis Ababa Route Finder
 *
 * Color palette inspired by Ethiopian landscapes:
 *   Primary blue = trust/reliability for transit
 *   Amber accent = Ethiopian gold
 *   Transport-specific colors for bus vs taxi
 */

import '@/global.css';

import { Platform } from 'react-native';

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

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
