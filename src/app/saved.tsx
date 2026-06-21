/**
 * Saved Routes Screen — User's favorite/bookmarked routes
 *
 * Shows persisted route searches that the user has saved.
 * Supports quick re-search and delete with Paper Dialog confirmation.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Button,
  Icon,
  Dialog,
  Portal,
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={{ fontWeight: '800' }}>Saved</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Your bookmarked routes
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isLoaded ? (
          <View style={styles.loadingState}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Loading...
            </Text>
          </View>
        ) : savedRoutes.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryContainer }]}>
              <Icon source="bookmark-outline" size={48} color={theme.colors.primary} />
            </View>
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>No saved routes yet</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 }}>
              When you find a route on the Home tab, tap the bookmark icon to save it here for quick access.
            </Text>
            <Button
              mode="contained"
              icon="magnify"
              onPress={() => router.navigate('/')}
              style={{ marginTop: 8, borderRadius: 20 }}
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
              <Card key={route.id} style={styles.savedCard}>
                <Card.Content style={styles.savedCardContent}>
                  <View style={[styles.savedIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Icon source="compass" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.savedInfo}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {route.fromStopName}
                    </Text>
                    <View style={styles.arrowRow}>
                      <Icon source="arrow-down" size={14} color={theme.colors.onSurfaceVariant} />
                    </View>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {route.toStopName}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                      Saved {formatDate(route.savedAt)}
                    </Text>
                  </View>
                  <View style={styles.savedActions}>
                    <IconButton
                      icon="magnify"
                      size={16}
                      mode="contained-tonal"
                      onPress={() => handleSearch(route)}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      size={16}
                      iconColor={theme.colors.error}
                      onPress={() => handleDelete(route)}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteTarget !== null} onDismiss={() => setDeleteTarget(null)}>
          <Dialog.Title>Remove Saved Route</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Remove {deleteTarget?.fromStopName} → {deleteTarget?.toStopName} from saved?
            </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    gap: 4,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  savedCard: {
    overflow: 'hidden',
  },
  savedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedInfo: {
    flex: 1,
    gap: 2,
  },
  arrowRow: {
    paddingLeft: 2,
    paddingVertical: 2,
  },
  savedActions: {
    gap: 4,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
