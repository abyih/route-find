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

        <Text variant="titleMedium" style={{ fontWeight: '700' }}>Group Members</Text>
        <Card mode="outlined">
          <Card.Content style={{ padding: 0 }}>
            <List.Item
              title="Abiy Hailu Miruts"
              description="ID: UGR/2461/16"
            />
            <Divider />
            <List.Item
              title="Eden Gosaye"
              description="ID: UGR/8305/16"
            />
            <Divider />
            <List.Item
              title="Ehsan Mujib"
              description="ID: UGR/9110/16"
            />
            <Divider />
            <List.Item
              title="Ephrata Belachew"
              description="ID: UGR/1633/16"
            />
            <Divider />
            <List.Item
              title="Ertiban Debebe"
              description="ID: UGR/3920/16"
            />
            <Divider />
            <List.Item
              title="Meklit Mesfin"
              description="ID: UGR/7509/16"
            />
            <Divider />
            <List.Item
              title="Marsilas Addisu"
              description="ID: UGR/8249/16"
            />
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
