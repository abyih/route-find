/**
 * About Screen — App details, instructions, and offline status
 *
 * Built using React Native Paper v5 components with forced light theme layout.
 */

import React from 'react';
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
        {/* Header */}
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
        {/* Main App Card */}
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
              A lightweight, offline-first helper for navigating public transit (minibus taxis and buses) across Addis Ababa, Ethiopia.
            </Text>
          </Card.Content>
        </Card>

        {/* How to Use */}
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

        {/* Features */}
        <Text variant="titleMedium" style={{ fontWeight: '700' }}>App Features</Text>
        <Card mode="outlined">
          <Card.Content style={{ padding: 0 }}>
            <List.Item
              title="100% Offline-First"
              description="Does not require active internet or map data to route you."
              left={() => <List.Icon icon="wifi-off" />}
            />
            <Divider />
            <List.Item
              title="Multi-Modal Transit"
              description="Routes across both minibus taxis and Anbessa/Sheger buses."
              left={() => <List.Icon icon="bus-multiple" />}
            />
            <Divider />
            <List.Item
              title="Addis Ababa Coverage"
              description="Maps major stations (Mexico, Megenagna, Bole, Piassa, Torhayloch, 4 Kilo, etc.)."
              left={() => <List.Icon icon="map-marker-radius" />}
            />
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
