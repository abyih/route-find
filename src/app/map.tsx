/**
 * Map Screen — Interactive map showing all transit stops
 *
 * Displays a MapView centered on Addis Ababa with custom markers
 * for bus and taxi stops. Shows user location and nearby stops.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STOPS } from '@/data/routeData';
import { getConnectionsFrom } from '@/data/routeData';
import { Stop, TransportType } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

const ADDIS_ABABA_REGION = {
  latitude: 9.015,
  longitude: 38.755,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type FilterType = 'all' | 'taxi' | 'bus';

export default function MapScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const filteredStops = STOPS.filter(s => {
    if (filter === 'all') return true;
    return s.type === filter || s.type === 'both';
  });

  // Request location
  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        mapRef.current?.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }, 1000);
      }
    } catch {
      // Location access denied or failed
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const getMarkerColor = (type: TransportType): string => {
    switch (type) {
      case 'bus': return theme.bus;
      case 'taxi': return theme.taxi;
      case 'both': return theme.primary;
    }
  };

  const handleMarkerPress = (stop: Stop) => {
    setSelectedStop(stop);
  };

  const connectionCount = (stopId: string) => getConnectionsFrom(stopId).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={ADDIS_ABABA_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        provider={PROVIDER_DEFAULT}
      >
        {filteredStops.map(stop => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            pinColor={getMarkerColor(stop.type)}
            onPress={() => handleMarkerPress(stop)}
          >
            <Callout tooltip style={styles.calloutContainer}>
              <View style={[styles.callout, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.calloutTitle, { color: theme.text }]}>{stop.name}</Text>
                <View style={styles.calloutBadges}>
                  <View style={[styles.calloutBadge, {
                    backgroundColor: stop.type === 'bus' ? theme.busLight : stop.type === 'taxi' ? theme.taxiLight : theme.primaryLight,
                  }]}>
                    <Text style={[styles.calloutBadgeText, {
                      color: stop.type === 'bus' ? theme.bus : stop.type === 'taxi' ? theme.taxi : theme.primary,
                    }]}>
                      {stop.type === 'both' ? '🚌🚕' : stop.type === 'bus' ? '🚌 Bus' : '🚕 Taxi'}
                    </Text>
                  </View>
                  <Text style={[styles.calloutRoutes, { color: theme.textSecondary }]}>
                    {connectionCount(stop.id)} route{connectionCount(stop.id) !== 1 ? 's' : ''}
                  </Text>
                </View>
                {stop.note && (
                  <Text style={[styles.calloutNote, { color: theme.accent }]}>{stop.note}</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Top bar overlay */}
      <SafeAreaView edges={['top']} style={styles.topOverlay}>
        <View style={[styles.topBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="map" size={20} color={theme.primary} />
          <Text style={[styles.topTitle, { color: theme.text }]}>Transit Map</Text>
          <Text style={[styles.stopCount, { color: theme.textSecondary }]}>
            {filteredStops.length} stops
          </Text>
        </View>
      </SafeAreaView>

      {/* Filter chips */}
      <View style={styles.filterContainer}>
        {(['all', 'taxi', 'bus'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? theme.primary : theme.card,
                borderColor: filter === f ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={f === 'all' ? 'options' : f === 'bus' ? 'bus' : 'car'}
              size={14}
              color={filter === f ? '#FFFFFF' : theme.textSecondary}
            />
            <Text style={[
              styles.filterText,
              { color: filter === f ? '#FFFFFF' : theme.text },
            ]}>
              {f === 'all' ? 'All' : f === 'bus' ? 'Bus' : 'Taxi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My Location button */}
      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={requestLocation}
        activeOpacity={0.7}
      >
        {locationLoading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Ionicons name="locate" size={22} color={theme.primary} />
        )}
      </TouchableOpacity>

      {/* Selected stop bottom card */}
      {selectedStop && (
        <View style={styles.bottomCard}>
          <View style={[styles.stopDetailCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.stopDetailHeader}>
              <View style={[styles.stopDetailIcon, {
                backgroundColor: selectedStop.type === 'bus' ? theme.busLight :
                  selectedStop.type === 'taxi' ? theme.taxiLight : theme.primaryLight,
              }]}>
                <Ionicons
                  name={selectedStop.type === 'bus' ? 'bus' : selectedStop.type === 'taxi' ? 'car' : 'swap-horizontal'}
                  size={20}
                  color={selectedStop.type === 'bus' ? theme.bus : selectedStop.type === 'taxi' ? theme.taxi : theme.primary}
                />
              </View>
              <View style={styles.stopDetailInfo}>
                <Text style={[styles.stopDetailName, { color: theme.text }]}>{selectedStop.name}</Text>
                <Text style={[styles.stopDetailType, { color: theme.textSecondary }]}>
                  {selectedStop.type === 'both' ? 'Bus & Taxi' : selectedStop.type === 'bus' ? 'Bus Stop' : 'Taxi Stop'}
                  {selectedStop.isPassingBy ? ' · Flag down' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedStop(null)}>
                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {selectedStop.note && (
              <Text style={[styles.stopDetailNote, { color: theme.accent }]}>
                ℹ️ {selectedStop.note}
              </Text>
            )}
            <View style={styles.stopDetailMeta}>
              <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="git-branch-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                  {connectionCount(selectedStop.id)} outgoing route{connectionCount(selectedStop.id) !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  stopCount: {
    fontSize: 13,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 110, android: 100 }),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  locationButton: {
    position: 'absolute',
    bottom: Platform.select({ ios: 180, android: 160 }),
    right: Spacing.three,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  calloutContainer: {
    width: 200,
  },
  callout: {
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  calloutBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calloutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  calloutBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  calloutRoutes: {
    fontSize: 11,
  },
  calloutNote: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  bottomCard: {
    position: 'absolute',
    bottom: Platform.select({ ios: 100, android: 90 }),
    left: Spacing.three,
    right: Spacing.three,
    zIndex: 10,
  },
  stopDetailCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  stopDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopDetailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDetailInfo: {
    flex: 1,
    gap: 2,
  },
  stopDetailName: {
    fontSize: 16,
    fontWeight: '700',
  },
  stopDetailType: {
    fontSize: 12,
  },
  stopDetailNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  stopDetailMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  metaChipText: {
    fontSize: 12,
  },
});
