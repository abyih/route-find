import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Platform, ScrollView, StatusBar, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '@/components/RouteCard';
import { StopSelector } from '@/components/StopSelector';
import { getStopById } from '@/data/routeData';
import { findRoutes } from '@/data/routeEngine';
import { RouteResult, SavedRoute, Stop } from '@/data/types';
import { useSavedRoutes } from '@/hooks/use-saved-routes';
import { useAppTheme } from '@/hooks/use-theme';

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
    setTimeout(() => {
      setResults(findRoutes(fromStop.id, toStop.id));
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Hero Header */}
        <LinearGradient
          colors={[theme.colors.gradient1, theme.colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingBottom: 40 }}
        >
          <SafeAreaView
            edges={['top']}
            style={{
              padding: 24,
              paddingTop: Platform.select({ android: (StatusBar.currentHeight ?? 20) + 24, default: 24 }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Icon source="compass" size={28} color="#FFFFFF" />
              <View>
                <Text variant="headlineSmall" style={{ color: '#FFFFFF' }}>Route Finder</Text>
                <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)' }}>Addis Ababa Transit</Text>
              </View>
            </View>
            <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Find the best way to get around the city using minibus taxis and buses
            </Text>
          </SafeAreaView>
        </LinearGradient>

        {/* Search Section */}
        <View style={{ padding: 16, marginTop: -24, gap: 12 }}>
          <StopSelector
            label="From"
            placeholder="Where are you?"
            selectedStop={fromStop}
            onSelect={setFromStop}
            icon="map-marker"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 }}>
            <Divider style={{ flex: 1 }} />
            <IconButton icon="swap-vertical" size={18} mode="outlined" onPress={handleSwap} />
            <Divider style={{ flex: 1 }} />
          </View>

          <StopSelector
            label="To"
            placeholder="Where to?"
            selectedStop={toStop}
            onSelect={setToStop}
            icon="flag"
          />

          <Button
            mode="contained"
            icon="magnify"
            onPress={handleSearch}
            disabled={!fromStop || !toStop || searching}
            loading={searching}
          >
            Find Routes
          </Button>
        </View>

        {/* Results */}
        {hasSearched && !searching && (
          <View style={{ padding: 16, gap: 12 }}>
            {results.length > 0 ? (
              <>
                <Text variant="titleMedium">
                  {results.length} route{results.length > 1 ? 's' : ''} found
                </Text>
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
              </>
            ) : (
              <Card>
                <Card.Content style={{ alignItems: 'center', padding: 32, gap: 8 }}>
                  <Icon source="alert-circle-outline" size={48} color={theme.colors.onSurfaceVariant} />
                  <Text variant="titleSmall">No routes found</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                    We couldn't find a route between these stops. Try a different combination or check the Routes tab.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </View>
        )}

        {/* Popular Routes */}
        {!hasSearched && (
          <View style={{ padding: 16, gap: 12 }}>
            <Text variant="titleMedium">Popular Routes</Text>
            {POPULAR_ROUTES.map((pr) => (
              <Card key={pr.label} onPress={() => handlePopularRoute(pr.from, pr.to)}>
                <Card.Title
                  title={pr.label}
                  left={(props) => <Icon {...props} source="trending-up" />}
                  right={(props) => <Icon {...props} source="chevron-right" />}
                />
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
