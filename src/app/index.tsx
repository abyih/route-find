/**
 * Home Screen — Route Search
 *
 * The main screen where users select origin/destination and find routes.
 * Features a premium gradient header, searchable stop selectors,
 * route results with visual timelines, and popular route suggestions.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StopSelector } from '@/components/StopSelector';
import { RouteCard } from '@/components/RouteCard';
import { findRoutes } from '@/data/routeEngine';
import { getStopById } from '@/data/routeData';
import { Stop, RouteResult, SavedRoute } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useSavedRoutes } from '@/hooks/use-saved-routes';
import { BorderRadius, Spacing } from '@/constants/theme';

// Popular routes for quick suggestions
const POPULAR_ROUTES = [
  { from: 'mexico', to: 'megenagna', label: 'Mexico → Megenagna' },
  { from: 'bole', to: 'piassa', label: 'Bole → Piassa' },
  { from: '4kilo', to: 'mexico', label: '4 Kilo → Mexico' },
  { from: 'megenagna', to: 'kaliti', label: 'Megenagna → Kaliti' },
  { from: 'torhayloch', to: 'ayat', label: 'Torhayloch → Ayat' },
];

export default function HomeScreen() {
  const theme = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Header */}
        <LinearGradient
          colors={[theme.gradient1, theme.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
            <View style={styles.heroContent}>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroIcon}>
                  <Ionicons name="navigate" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.heroTitle}>Route Finder</Text>
                  <Text style={styles.heroSubtitle}>Addis Ababa Transit</Text>
                </View>
              </View>
              <Text style={styles.heroDescription}>
                Find the best way to get around the city using minibus taxis and buses
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Search Section */}
        <View style={[styles.searchSection, { backgroundColor: theme.background }]}>
          <View style={styles.searchCard}>
            <StopSelector
              label="From"
              placeholder="Where are you?"
              selectedStop={fromStop}
              onSelect={setFromStop}
              icon="location"
            />

            {/* Swap button */}
            <View style={styles.swapRow}>
              <View style={[styles.swapLine, { backgroundColor: theme.border }]} />
              <TouchableOpacity
                style={[styles.swapButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={handleSwap}
                activeOpacity={0.7}
              >
                <Ionicons name="swap-vertical" size={18} color={theme.primary} />
              </TouchableOpacity>
              <View style={[styles.swapLine, { backgroundColor: theme.border }]} />
            </View>

            <StopSelector
              label="To"
              placeholder="Where to?"
              selectedStop={toStop}
              onSelect={setToStop}
              icon="flag"
            />

            {/* Search Button */}
            <LinearGradient
              colors={[
                fromStop && toStop ? theme.gradient1 : theme.border,
                fromStop && toStop ? theme.gradient2 : theme.border,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.searchButtonGradient, { opacity: fromStop && toStop ? 1 : 0.5 }]}
            >
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={!fromStop || !toStop || searching}
                activeOpacity={0.8}
              >
                {searching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="search" size={18} color="#FFFFFF" />
                    <Text style={styles.searchButtonText}>Find Routes</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Results */}
        {hasSearched && !searching && (
          <View style={styles.resultsSection}>
            {results.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
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
              <View style={[styles.noResults, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.noResultsTitle, { color: theme.text }]}>No routes found</Text>
                <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                  We couldn't find a route between these stops. Try a different combination or check the Routes tab for all connections.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Popular Routes (shown when no search has been done) */}
        {!hasSearched && (
          <View style={styles.popularSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Popular Routes
            </Text>
            <View style={styles.popularGrid}>
              {POPULAR_ROUTES.map((pr) => (
                <TouchableOpacity
                  key={pr.label}
                  style={[styles.popularCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => handlePopularRoute(pr.from, pr.to)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.popularIcon, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="trending-up" size={16} color={theme.primary} />
                  </View>
                  <Text style={[styles.popularLabel, { color: theme.text }]} numberOfLines={1}>
                    {pr.label}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={theme.textSecondary} />
                </TouchableOpacity>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.select({ android: StatusBar.currentHeight ?? 20, default: 0 }),
  },
  heroContent: {
    paddingTop: Spacing.four,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  searchSection: {
    marginTop: -24,
    paddingHorizontal: Spacing.three,
  },
  searchCard: {
    gap: 0,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -4,
    zIndex: 1,
    paddingHorizontal: Spacing.four,
  },
  swapLine: {
    flex: 1,
    height: 1,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 8,
  },
  searchButtonGradient: {
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.three,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsSection: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultsList: {
    gap: 12,
  },
  noResults: {
    alignItems: 'center',
    padding: Spacing.five,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 12,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  noResultsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  popularSection: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  popularGrid: {
    gap: 8,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
  },
  popularIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
