import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import AppTabs from '@/components/app-tabs';
import { getPaperTheme } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = getPaperTheme(colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <PaperProvider theme={theme}>
      <AppTabs />
    </PaperProvider>
  );
}
