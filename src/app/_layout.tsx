import { PaperProvider } from 'react-native-paper';

import AppTabs from '@/components/app-tabs';
import { getPaperTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = getPaperTheme('light');

  return (
    <PaperProvider theme={theme}>
      <AppTabs />
    </PaperProvider>
  );
}
