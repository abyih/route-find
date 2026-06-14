/**
 * Saved Routes Screen — User's favorite/bookmarked routes
 *
 * Shows persisted route searches that the user has saved.
 * Supports quick re-search and swipe-to-delete.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSavedRoutes } from '@/hooks/use-saved-routes';
import { SavedRoute } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

export default function SavedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { savedRoutes, removeRoute, isLoaded } = useSavedRoutes();

  const handleDelete = useCallback((route: SavedRoute) => {
    if (Platform.OS === 'web') {
      removeRoute(route.id);
      return;
    }
    Alert.alert(
      'Remove Saved Route',
      `Remove ${route.fromStopName} → ${route.toStopName} from saved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeRoute(route.id) },
      ]
    );
  }, [removeRoute]);

  const handleSearch = useCallback((route: SavedRoute) => {
    // Navigate to home tab — the user will need to search again
    // In a more advanced version, we could pass params
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Saved</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
          </View>
        ) : savedRoutes.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="bookmark-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No saved routes yet</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              When you find a route on the Home tab, tap the bookmark icon to save it here for quick access.
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: theme.primary }]}
              onPress={() => router.navigate('/')}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={16} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Find a Route</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.savedCount, { color: theme.textSecondary }]}>
              {savedRoutes.length} saved route{savedRoutes.length !== 1 ? 's' : ''}
            </Text>
            {savedRoutes.map(route => (
              <View
                key={route.id}
                style={[styles.savedCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.savedCardContent}>
                  <View style={[styles.savedIcon, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="navigate" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.savedInfo}>
                    <Text style={[styles.savedRoute, { color: theme.text }]}>
                      {route.fromStopName}
                    </Text>
                    <View style={styles.arrowRow}>
                      <Ionicons name="arrow-down" size={14} color={theme.textSecondary} />
                    </View>
                    <Text style={[styles.savedRoute, { color: theme.text }]}>
                      {route.toStopName}
                    </Text>
                    <Text style={[styles.savedDate, { color: theme.textSecondary }]}>
                      Saved {formatDate(route.savedAt)}
                    </Text>
                  </View>
                  <View style={styles.savedActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.primaryLight }]}
                      onPress={() => handleSearch(route)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="search" size={16} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.backgroundElement }]}
                      onPress={() => handleDelete(route)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: Spacing.three,
  },
  header: {
    paddingTop: Spacing.three,
    gap: 4,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: 10,
  },
  savedCount: {
    fontSize: 13,
    marginBottom: 4,
  },
  savedCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  savedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
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
  savedRoute: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrowRow: {
    paddingLeft: 2,
    paddingVertical: 2,
  },
  savedDate: {
    fontSize: 11,
    marginTop: 4,
  },
  savedActions: {
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: Spacing.four,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    gap: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
