/**
 * Routes Screen — Browse all transit routes from each hub
 *
 * Lists all major hubs as expandable accordions. Tap a hub to see
 * all departing routes with destinations and transport type.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Searchbar,
  Chip,
  List,
  Icon,
  Divider,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STOPS, CONNECTIONS, getStopById } from '@/data/routeData';
import { RouteConnection } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';

interface HubData {
  stopId: string;
  stopName: string;
  connections: RouteConnection[];
  stopType: string;
}

export default function RoutesScreen() {
  const theme = useAppTheme();
  const [search, setSearch] = useState('');
  const [expandedHub, setExpandedHub] = useState<string | null>(null);

  // Build hub data: stops that have outgoing connections
  const hubs: HubData[] = useMemo(() => {
    const hubMap = new Map<string, RouteConnection[]>();

    for (const conn of CONNECTIONS) {
      if (!hubMap.has(conn.fromStopId)) {
        hubMap.set(conn.fromStopId, []);
      }
      hubMap.get(conn.fromStopId)!.push(conn);
    }

    return Array.from(hubMap.entries())
      .map(([stopId, connections]) => {
        const stop = getStopById(stopId);
        return {
          stopId,
          stopName: stop?.name ?? stopId,
          connections: connections.sort((a, b) => {
            const aName = getStopById(a.toStopId)?.name ?? '';
            const bName = getStopById(b.toStopId)?.name ?? '';
            return aName.localeCompare(bName);
          }),
          stopType: stop?.type ?? 'taxi',
        };
      })
      .sort((a, b) => b.connections.length - a.connections.length);
  }, []);

  const filteredHubs = useMemo(() => {
    if (!search.trim()) return hubs;
    const q = search.toLowerCase();
    return hubs.filter(h =>
      h.stopName.toLowerCase().includes(q) ||
      h.connections.some(c => {
        const dest = getStopById(c.toStopId);
        return dest?.name.toLowerCase().includes(q);
      })
    );
  }, [hubs, search]);

  const getHubIcon = (type: string) => {
    if (type === 'bus') return 'bus';
    if (type === 'taxi') return 'taxi';
    return 'swap-horizontal';
  };

  const getHubColor = (type: string) => {
    if (type === 'bus') return theme.colors.bus;
    if (type === 'taxi') return theme.colors.taxi;
    return theme.colors.primary;
  };

  const getHubBg = (type: string) => {
    if (type === 'bus') return theme.colors.busLight;
    if (type === 'taxi') return theme.colors.taxiLight;
    return theme.colors.primaryLight;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={{ fontWeight: '800' }}>Routes</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Browse all transit connections
          </Text>
        </View>

        {/* Search */}
        <Searchbar
          placeholder="Search hubs or destinations..."
          value={search}
          onChangeText={setSearch}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={0}
        />

        {/* Stats */}
        <View style={styles.statsRow}>
          <Chip
            compact
            mode="flat"
            icon="map-marker"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          >
            {STOPS.length} stops
          </Chip>
          <Chip
            compact
            mode="flat"
            icon="source-branch"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
          >
            {CONNECTIONS.length} routes
          </Chip>
          <Chip
            compact
            mode="flat"
            icon="bus"
            style={{ backgroundColor: theme.colors.tertiaryContainer }}
          >
            {filteredHubs.length} hubs
          </Chip>
        </View>
      </SafeAreaView>

      {/* Hub List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredHubs.map(hub => (
          <Surface key={hub.stopId} style={styles.hubCard} elevation={1}>
            <List.Accordion
              title={hub.stopName}
              description={`${hub.connections.length} destination${hub.connections.length !== 1 ? 's' : ''}`}
              expanded={expandedHub === hub.stopId}
              onPress={() => setExpandedHub(prev => prev === hub.stopId ? null : hub.stopId)}
              left={props => (
                <View style={[styles.hubIcon, { backgroundColor: getHubBg(hub.stopType) }]}>
                  <Icon source={getHubIcon(hub.stopType)} size={18} color={getHubColor(hub.stopType)} />
                </View>
              )}
              style={{ paddingLeft: 0 }}
              titleStyle={{ fontWeight: '700' }}
            >
              {hub.connections.map((conn, idx) => {
                const dest = getStopById(conn.toStopId);
                if (!dest) return null;
                return (
                  <React.Fragment key={`${conn.fromStopId}-${conn.toStopId}-${idx}`}>
                    {idx > 0 && <Divider style={{ marginLeft: 56 }} />}
                    <List.Item
                      title={dest.name}
                      titleStyle={{ fontSize: 13 }}
                      left={() => (
                        <View style={styles.connectionIconContainer}>
                          <Icon source="arrow-right" size={14} color={theme.colors.onSurfaceVariant} />
                        </View>
                      )}
                      right={() => (
                        <View style={styles.connectionRight}>
                          <Chip
                            compact
                            mode="flat"
                            textStyle={{ fontSize: 10 }}
                            style={{
                              backgroundColor: conn.transportType === 'bus' ? theme.colors.busLight : theme.colors.taxiLight,
                            }}
                          >
                            {conn.transportType === 'bus' ? '🚌' : '🚕'}
                          </Chip>
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            ~{conn.estimatedTime}m
                          </Text>
                          {conn.isPassingBy && (
                            <Chip
                              compact
                              mode="flat"
                              textStyle={{ fontSize: 10, color: theme.colors.accent }}
                              style={{ backgroundColor: theme.colors.accentLight }}
                            >
                              🤚
                            </Chip>
                          )}
                        </View>
                      )}
                      style={styles.connectionItem}
                    />
                  </React.Fragment>
                );
              })}
            </List.Accordion>
          </Surface>
        ))}

        {filteredHubs.length === 0 && (
          <View style={styles.emptyState}>
            <Icon source="magnify" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
              No hubs match "{search}"
            </Text>
          </View>
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
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    paddingTop: 16,
    gap: 4,
  },
  searchBar: {
    elevation: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  hubCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  hubIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  connectionIconContainer: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  connectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionItem: {
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
});
