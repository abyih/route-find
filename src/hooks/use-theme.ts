import { useTheme } from 'react-native-paper';
import type { AppTheme } from '@/constants/theme';

export function useAppTheme() {
  return useTheme<AppTheme>();
}
