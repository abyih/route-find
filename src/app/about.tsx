import { ScrollView, StatusBar, View } from 'react-native';
import {
  Card,
  Divider,
  Icon,
  List,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-theme';

export default function AboutScreen() {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={{ paddingHorizontal: 16 }}>
        <View style={{ paddingTop: 16, gap: 4, paddingBottom: 16 }}>
          <Text variant="headlineSmall" style={{ fontWeight: '800' }}>About</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Addis Ababa Transit Route Finder
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Card mode="outlined">
          <Card.Content style={{ gap: 12, alignItems: 'center', paddingVertical: 24 }}>
            <View style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primaryContainer }}>
              <Icon source="compass" size={36} color={theme.colors.primary} />
            </View>
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text variant="titleMedium" style={{ fontWeight: '700' }}>Route Finder</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Version 1.0.0</Text>
            </View>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
              A lightweight, offline-first helper for navigating Addis Ababa's taxi routes
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={{ fontWeight: '700' }}>How to Use</Text>
        <Card mode="outlined">
          <Card.Content style={{ padding: 0 }}>
            <List.Item
              title="Search Routes"
              description="Select your origin and destination stops on the Home screen to see the optimal paths."
              left={() => <List.Icon icon="magnify" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title="Explore Hubs"
              description="Browse connections departing from major terminal stations on the Routes screen."
              left={() => <List.Icon icon="source-branch" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title="Quick Access"
              description="Bookmark your frequent route searches on the Home screen to access them quickly on the Saved tab."
              left={() => <List.Icon icon="bookmark" color={theme.colors.primary} />}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={{ fontWeight: '700' }}>Project Team</Text>
        <Card mode="outlined">
          <Card.Content style={{ padding: 0 }}>
            <List.Item
              title="[Student Name 1]"
              description="ID: [Student ID 1]"
              left={() => <List.Icon icon="account" />}
            />
            <Divider />
            <List.Item
              title="[Student Name 2]"
              description="ID: [Student ID 2]"
              left={() => <List.Icon icon="account" />}
            />
            <Divider />
            <List.Item
              title="[Student Name 3]"
              description="ID: [Student ID 3]"
              left={() => <List.Icon icon="account" />}
            />
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
