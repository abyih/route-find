/**
 * Routes Screen — Browse all transit routes from each hub
 *
 * Lists all major hubs as expandable accordions. Tap a hub to see
 * all departing routes with destinations and transport type.
 * Optimized with FlatList virtualization for high performance.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, StatusBar, View } from 'react-native';
import {
  Card,
  Chip,
  Divider,
  Icon,
  List,
  Searchbar,
  Text,
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

  const renderHubItem = useCallback(({ item: hub }: { item: HubData }) => {
    return (
      <Card style={{ marginBottom: 12 }} mode="outlined">
        <List.Accordion
          title={hub.stopName}
          description={`${hub.connections.length} destination${hub.connections.length !== 1 ? 's' : ''}`}
          expanded={expandedHub === hub.stopId}
          onPress={() => setExpandedHub(prev => prev === hub.stopId ? null : hub.stopId)}
          left={props => (
            <View style={{ marginLeft: 8, justifyContent: 'center' }}>
              <Icon source={getHubIcon(hub.stopType)} size={24} color={theme.colors.primary} />
            </View>
          )}
          titleStyle={{ fontWeight: '700' }}
        >
          {hub.connections.map((conn, idx) => {
            const dest = getStopById(conn.toStopId);
            if (!dest) return null;
            return (
              <View key={`${conn.fromStopId}-${conn.toStopId}-${idx}`}>
                {idx > 0 && <Divider />}
                <List.Item
                  title={dest.name}
                  titleStyle={{ fontSize: 14 }}
                  left={() => (
                    <View style={{ justifyContent: 'center', marginLeft: 16 }}>
                      <Icon source="arrow-right" size={16} color={theme.colors.onSurfaceVariant} />
                    </View>
                  )}
                  right={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Chip compact mode="outlined">
                        {conn.transportType === 'bus' ? '🚌 Bus' : '🚕 Taxi'}
                      </Chip>
                      {conn.isPassingBy && (
                        <Chip compact mode="flat">
                          🤚 Flag down
                        </Chip>
                      )}
                    </View>
                  )}
                  style={{ paddingVertical: 8 }}
                />
              </View>
            );
          })}
        </List.Accordion>
      </Card>
    );
  }, [expandedHub, theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={{ paddingHorizontal: 16, gap: 12 }}>
        {/* Header */}
        <View style={{ paddingTop: 16, gap: 4 }}>
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
          elevation={0}
        />

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <Chip compact mode="flat" icon="map-marker">
            {STOPS.length} stops
          </Chip>
          <Chip compact mode="flat" icon="source-branch">
            {CONNECTIONS.length} routes
          </Chip>
          <Chip compact mode="flat" icon="bus">
            {filteredHubs.length} hubs
          </Chip>
        </View>
      </SafeAreaView>

      {/* Hub List using FlatList for virtualization and optimization */}
      <FlatList
        data={filteredHubs}
        keyExtractor={item => item.stopId}
        renderItem={renderHubItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          filteredHubs.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48, gap: 12 }}>
              <Icon source="magnify" size={48} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No hubs match "{search}"
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
