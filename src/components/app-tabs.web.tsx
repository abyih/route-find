/**
 * App Tabs — Bottom tab navigation (Web)
 *
 * 3 tabs: Home, Routes, Saved
 * Simplified for web using expo-router/ui Tabs with Paper components.
 */

import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { Icon, Surface, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/use-theme';
import { MaxContentWidth } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="compass">Home</TabButton>
          </TabTrigger>

          <TabTrigger name="routes" href="/routes" asChild>
            <TabButton icon="source-branch">Routes</TabButton>
          </TabTrigger>
          <TabTrigger name="saved" href="/saved" asChild>
            <TabButton icon="bookmark">Saved</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon: string }) {
  const theme = useAppTheme();

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <Surface
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
          },
        ]}
        elevation={0}
      >
        <Icon
          source={icon}
          size={16}
          color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
        <Text
          variant="labelSmall"
          style={{
            color: isFocused ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
          }}
        >
          {children}
        </Text>
      </Surface>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useAppTheme();

  return (
    <View {...props} style={styles.tabListContainer}>
      <Surface style={styles.innerContainer} elevation={1}>
        <Text variant="labelLarge" style={[styles.brandText, { color: theme.colors.onSurface }]}>
          Route Finder
        </Text>
        {props.children}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: 8,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 6,
  },
});
