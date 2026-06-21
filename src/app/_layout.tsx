import { PaperProvider } from 'react-native-paper';

import AppTabs from '@/components/app-tabs';
import { getPaperTheme } from '@/constants/theme';
import { SavedRoutesProvider } from '@/hooks/use-saved-routes';

export default function TabLayout() {
  const theme = getPaperTheme('light');

  return (
    <PaperProvider theme={theme}>
      <SavedRoutesProvider>
        <AppTabs />
      </SavedRoutesProvider>
    </PaperProvider>
  );
}
