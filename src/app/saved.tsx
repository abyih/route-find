/**
 * Saved Routes Screen — User's favorite/bookmarked routes
 *
 * Shows persisted route searches that the user has saved.
 * Supports quick re-search and delete with Paper Dialog confirmation.
 */

import React, { useCallback, useState } from 'react';
import { ScrollView, Platform, StatusBar, View } from 'react-native';
import {
  Button,
  Card,
  Dialog,
  Icon,
  IconButton,
  Portal,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSavedRoutes } from '@/hooks/use-saved-routes';
import { SavedRoute } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';

export default function SavedScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { savedRoutes, removeRoute, isLoaded } = useSavedRoutes();
  const [deleteTarget, setDeleteTarget] = useState<SavedRoute | null>(null);

  const handleDelete = useCallback((route: SavedRoute) => {
    if (Platform.OS === 'web') {
      removeRoute(route.id);
      return;
    }
    setDeleteTarget(route);
  }, [removeRoute]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      removeRoute(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, removeRoute]);

  const handleSearch = useCallback((route: SavedRoute) => {
    router.navigate('/');
  }, [router]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={{ paddingHorizontal: 16 }}>
        {/* Header */}
        <View style={{ paddingTop: 16, gap: 4, paddingBottom: 16 }}>
          <Text variant="headlineSmall" style={{ fontWeight: '800' }}>Saved</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Your bookmarked routes
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {!isLoaded ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Loading...
            </Text>
          </View>
        ) : savedRoutes.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 16 }}>
            <Icon source="bookmark-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>No saved routes yet</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 }}>
              When you find a route on the Home tab, tap the bookmark icon to save it here for quick access.
            </Text>
            <Button
              mode="contained"
              icon="magnify"
              onPress={() => router.navigate('/')}
            >
              Find a Route
            </Button>
          </View>
        ) : (
          <>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
              {savedRoutes.length} saved route{savedRoutes.length !== 1 ? 's' : ''}
            </Text>
            {savedRoutes.map(route => (
              <Card key={route.id} mode="outlined">
                <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <Icon source="compass" size={24} color={theme.colors.primary} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {route.fromStopName}
                      </Text>
                      <Icon source="arrow-right" size={14} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {route.toStopName}
                      </Text>
                    </View>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Saved {formatDate(route.savedAt)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <IconButton
                      icon="magnify"
                      size={20}
                      mode="contained-tonal"
                      onPress={() => handleSearch(route)}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => handleDelete(route)}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteTarget !== null} onDismiss={() => setDeleteTarget(null)}>
          <Dialog.Title>Remove Saved Route</Dialog.Title>
          <Dialog.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <Text variant="bodyMedium">Remove</Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{deleteTarget?.fromStopName}</Text>
              <Icon source="arrow-right" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{deleteTarget?.toStopName}</Text>
              <Text variant="bodyMedium">from saved?</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>Remove</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
