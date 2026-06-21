/**
 * Home Screen — Route Search
 *
 * The main screen where users select origin/destination and find routes.
 * Features a gradient header, searchable stop selectors,
 * route results with visual timelines, and popular route suggestions.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  IconButton,
  Card,
  Icon,
  ActivityIndicator,
  Divider,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StopSelector } from '@/components/StopSelector';
import { RouteCard } from '@/components/RouteCard';
import { findRoutes } from '@/data/routeEngine';
import { getStopById } from '@/data/routeData';
import { Stop, RouteResult, SavedRoute } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';
import { useSavedRoutes } from '@/hooks/use-saved-routes';

// Popular routes for quick suggestions
const POPULAR_ROUTES = [
  { from: 'mexico', to: 'megenagna', label: 'Mexico → Megenagna' },
  { from: 'bole', to: 'piassa', label: 'Bole → Piassa' },
  { from: '4kilo', to: 'mexico', label: '4 Kilo → Mexico' },
  { from: 'megenagna', to: 'kaliti', label: 'Megenagna → Kaliti' },
  { from: 'torhayloch', to: 'ayat', label: 'Torhayloch → Ayat' },
];

export default function HomeScreen() {
  const theme = useAppTheme();
  const { saveRoute, removeRoute, isRouteSaved } = useSavedRoutes();

  const [fromStop, setFromStop] = useState<Stop | null>(null);
  const [toStop, setToStop] = useState<Stop | null>(null);
  const [results, setResults] = useState<RouteResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(() => {
    if (!fromStop || !toStop) return;

    setSearching(true);
    setHasSearched(true);

    // Small delay for UX feedback
    setTimeout(() => {
      const routes = findRoutes(fromStop.id, toStop.id);
      setResults(routes);
      setSearching(false);
    }, 300);
  }, [fromStop, toStop]);

  const handleSwap = useCallback(() => {
    setFromStop(toStop);
    setToStop(fromStop);
    setResults([]);
    setHasSearched(false);
  }, [fromStop, toStop]);

  const handlePopularRoute = useCallback((from: string, to: string) => {
    const f = getStopById(from);
    const t = getStopById(to);
    if (f && t) {
      setFromStop(f);
      setToStop(t);
      setSearching(true);
      setHasSearched(true);
      setTimeout(() => {
        setResults(findRoutes(from, to));
        setSearching(false);
      }, 300);
    }
  }, []);

  const handleSaveRoute = useCallback((route: RouteResult) => {
    const first = route.segments[0];
    const last = route.segments[route.segments.length - 1];
    const savedId = `${first.fromStop.id}_${last.toStop.id}`;

    if (isRouteSaved(first.fromStop.id, last.toStop.id)) {
      removeRoute(savedId);
    } else {
      const saved: SavedRoute = {
        id: savedId,
        fromStopId: first.fromStop.id,
        toStopId: last.toStop.id,
        fromStopName: first.fromStop.name,
        toStopName: last.toStop.name,
        savedAt: Date.now(),
      };
      saveRoute(saved);
    }
  }, [isRouteSaved, saveRoute, removeRoute]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Header */}
        <LinearGradient
          colors={[theme.colors.gradient1, theme.colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
            <View style={styles.heroContent}>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroIcon}>
                  <Icon source="compass" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text variant="headlineSmall" style={styles.heroTitle}>Route Finder</Text>
                  <Text variant="bodySmall" style={styles.heroSubtitle}>Addis Ababa Transit</Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.heroDescription}>
                Find the best way to get around the city using minibus taxis and buses
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Search Section */}
        <View style={[styles.searchSection, { backgroundColor: theme.colors.background }]}>
          <View style={styles.searchCard}>
            <StopSelector
              label="From"
              placeholder="Where are you?"
              selectedStop={fromStop}
              onSelect={setFromStop}
              icon="map-marker"
            />

            {/* Swap button */}
            <View style={styles.swapRow}>
              <Divider style={styles.swapLine} />
              <IconButton
                icon="swap-vertical"
                size={18}
                mode="outlined"
                onPress={handleSwap}
                style={styles.swapButton}
              />
              <Divider style={styles.swapLine} />
            </View>

            <StopSelector
              label="To"
              placeholder="Where to?"
              selectedStop={toStop}
              onSelect={setToStop}
              icon="flag"
            />

            {/* Search Button */}
            <Button
              mode="contained"
              icon="magnify"
              onPress={handleSearch}
              disabled={!fromStop || !toStop || searching}
              loading={searching}
              style={styles.searchButton}
              contentStyle={styles.searchButtonContent}
              labelStyle={styles.searchButtonLabel}
            >
              Find Routes
            </Button>
          </View>
        </View>

        {/* Results */}
        {hasSearched && !searching && (
          <View style={styles.resultsSection}>
            {results.length > 0 ? (
              <>
                <Text variant="titleMedium" style={{ marginBottom: 4 }}>
                  {results.length} route{results.length > 1 ? 's' : ''} found
                </Text>
                <View style={styles.resultsList}>
                  {results.map((route, idx) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      index={idx}
                      onSave={handleSaveRoute}
                      isSaved={
                        route.segments.length > 0 &&
                        isRouteSaved(
                          route.segments[0].fromStop.id,
                          route.segments[route.segments.length - 1].toStop.id
                        )
                      }
                    />
                  ))}
                </View>
              </>
            ) : (
              <Card style={styles.noResultsCard}>
                <Card.Content style={styles.noResults}>
                  <Icon source="alert-circle-outline" size={48} color={theme.colors.onSurfaceVariant} />
                  <Text variant="titleSmall" style={{ marginTop: 12 }}>No routes found</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 18 }}>
                    We couldn't find a route between these stops. Try a different combination or check the Routes tab for all connections.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </View>
        )}

        {/* Popular Routes (shown when no search has been done) */}
        {!hasSearched && (
          <View style={styles.popularSection}>
            <Text variant="titleMedium" style={{ marginBottom: 4 }}>
              Popular Routes
            </Text>
            <View style={styles.popularGrid}>
              {POPULAR_ROUTES.map((pr) => (
                <Card
                  key={pr.label}
                  onPress={() => handlePopularRoute(pr.from, pr.to)}
                  style={styles.popularCard}
                >
                  <Card.Content style={styles.popularCardContent}>
                    <View style={[styles.popularIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Icon source="trending-up" size={16} color={theme.colors.primary} />
                    </View>
                    <Text variant="bodyMedium" numberOfLines={1} style={{ flex: 1 }}>
                      {pr.label}
                    </Text>
                    <Icon source="arrow-right" size={14} color={theme.colors.onSurfaceVariant} />
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroGradient: {
    paddingBottom: 40,
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: Platform.select({ android: StatusBar.currentHeight ?? 20, default: 0 }),
  },
  heroContent: {
    paddingTop: 24,
    gap: 12,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  searchSection: {
    marginTop: -24,
    paddingHorizontal: 16,
  },
  searchCard: {
    gap: 0,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -4,
    zIndex: 1,
    paddingHorizontal: 24,
  },
  swapLine: {
    flex: 1,
  },
  swapButton: {
    marginHorizontal: 8,
  },
  searchButton: {
    marginTop: 16,
    borderRadius: 16,
  },
  searchButtonContent: {
    paddingVertical: 6,
  },
  searchButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  resultsList: {
    gap: 12,
  },
  noResultsCard: {
    overflow: 'hidden',
  },
  noResults: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  popularSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  popularGrid: {
    gap: 8,
  },
  popularCard: {
    overflow: 'hidden',
  },
  popularCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  popularIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
