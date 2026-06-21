/**
 * Routes Screen — Browse all transit routes from each hub
 *
 * Lists all major hubs as expandable cards. Tap a hub to see
 * all departing routes with destinations and transport type.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STOPS, CONNECTIONS, getStopById, getConnectionsFrom } from '@/data/routeData';
import { RouteConnection } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface HubData {
  stopId: string;
  stopName: string;
  connections: RouteConnection[];
  stopType: string;
}

export default function RoutesScreen() {
  const theme = useTheme();
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

  const toggleHub = useCallback((hubId: string) => {
    setExpandedHub(prev => prev === hubId ? null : hubId);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Routes</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Browse all transit connections
          </Text>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search hubs or destinations..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="location" size={14} color={theme.primary} />
            <Text style={[styles.statText, { color: theme.primary }]}>
              {STOPS.length} stops
            </Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: theme.accentLight }]}>
            <Ionicons name="git-branch" size={14} color={theme.accent} />
            <Text style={[styles.statText, { color: theme.accent }]}>
              {CONNECTIONS.length} routes
            </Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: theme.successLight }]}>
            <Ionicons name="bus" size={14} color={theme.success} />
            <Text style={[styles.statText, { color: theme.success }]}>
              {filteredHubs.length} hubs
            </Text>
          </View>
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
          <View key={hub.stopId}>
            {/* Hub Header */}
            <TouchableOpacity
              style={[styles.hubCard, {
                backgroundColor: theme.card,
                borderColor: expandedHub === hub.stopId ? theme.primary : theme.border,
              }]}
              onPress={() => toggleHub(hub.stopId)}
              activeOpacity={0.7}
            >
              <View style={styles.hubHeader}>
                <View style={[styles.hubIcon, {
                  backgroundColor: hub.stopType === 'bus' ? theme.busLight :
                    hub.stopType === 'taxi' ? theme.taxiLight : theme.primaryLight,
                }]}>
                  <Ionicons
                    name={hub.stopType === 'bus' ? 'bus' : hub.stopType === 'taxi' ? 'car' : 'swap-horizontal'}
                    size={18}
                    color={hub.stopType === 'bus' ? theme.bus : hub.stopType === 'taxi' ? theme.taxi : theme.primary}
                  />
                </View>
                <View style={styles.hubInfo}>
                  <Text style={[styles.hubName, { color: theme.text }]}>{hub.stopName}</Text>
                  <Text style={[styles.hubCount, { color: theme.textSecondary }]}>
                    {hub.connections.length} destination{hub.connections.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Ionicons
                  name={expandedHub === hub.stopId ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.textSecondary}
                />
              </View>

              {/* Expanded connections */}
              {expandedHub === hub.stopId && (
                <View style={[styles.connectionsList, { borderTopColor: theme.border }]}>
                  {hub.connections.map((conn, idx) => {
                    const dest = getStopById(conn.toStopId);
                    if (!dest) return null;
                    return (
                      <View
                        key={`${conn.fromStopId}-${conn.toStopId}-${idx}`}
                        style={[styles.connectionItem, {
                          borderBottomColor: idx < hub.connections.length - 1 ? theme.border : 'transparent',
                        }]}
                      >
                        <View style={styles.connectionLeft}>
                          <Ionicons name="arrow-forward" size={14} color={theme.textSecondary} />
                          <Text style={[styles.connectionName, { color: theme.text }]}>{dest.name}</Text>
                        </View>
                        <View style={styles.connectionRight}>
                          <View style={[styles.transportTag, {
                            backgroundColor: conn.transportType === 'bus' ? theme.busLight : theme.taxiLight,
                          }]}>
                            <Text style={[styles.transportTagText, {
                              color: conn.transportType === 'bus' ? theme.bus : theme.taxi,
                            }]}>
                              {conn.transportType === 'bus' ? '🚌' : '🚕'}
                            </Text>
                          </View>
                          <Text style={[styles.connectionTime, { color: theme.textSecondary }]}>
                            ~{conn.estimatedTime}m
                          </Text>
                          {conn.isPassingBy && (
                            <View style={[styles.flagBadge, { backgroundColor: theme.accentLight }]}>
                              <Text style={[styles.flagText, { color: theme.accent }]}>🤚</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {filteredHubs.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
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
    paddingHorizontal: Spacing.three,
    gap: 12,
  },
  header: {
    paddingTop: Spacing.three,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 4 }),
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: Platform.select({ ios: 0, android: 6 }),
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: 10,
  },
  hubCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: 12,
  },
  hubIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubInfo: {
    flex: 1,
    gap: 2,
  },
  hubName: {
    fontSize: 15,
    fontWeight: '700',
  },
  hubCount: {
    fontSize: 12,
  },
  connectionsList: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  connectionName: {
    fontSize: 13,
    fontWeight: '500',
  },
  connectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transportTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  transportTagText: {
    fontSize: 11,
  },
  connectionTime: {
    fontSize: 11,
    minWidth: 30,
    textAlign: 'right',
  },
  flagBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  flagText: {
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
