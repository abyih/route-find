/**
 * App Tabs — Bottom tab navigation (Native)
 *
 * 3 tabs: Home, Routes, Saved
 * Uses expo-router Tabs with MaterialCommunityIcons for icons.
 */

import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Icon } from 'react-native-paper';

import { useAppTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          paddingTop: 4,
          height: Platform.select({ ios: 88, android: 64 }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon source="compass" size={size} color={color as string} />
          ),
        }}
      />

      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color, size }) => (
            <Icon source="source-branch" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Icon source="bookmark" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
