/**
 * useAppTheme — Returns the Paper MD3 theme with custom app colors.
 *
 * Wraps Paper's useTheme() and casts to our AppTheme type
 * so consumers get autocomplete for custom colors like bus, taxi, etc.
 */

import { useTheme } from 'react-native-paper';
import type { AppTheme } from '@/constants/theme';

export function useAppTheme() {
  return useTheme<AppTheme>();
}
