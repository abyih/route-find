/**
 * RouteCard — Displays a route search result
 *
 * Shows a visual timeline of segments with transfer indicators,
 * time badges, and an expandable detail view using Paper components.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Chip,
  Text,
  Icon,
  IconButton,
  Divider,
  TouchableRipple,
} from 'react-native-paper';
import { RouteResult } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';

interface RouteCardProps {
  route: RouteResult;
  index: number;
  onSave?: (route: RouteResult) => void;
  isSaved?: boolean;
}

export function RouteCard({ route, index, onSave, isSaved }: RouteCardProps) {
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  const firstStop = route.segments[0].fromStop;
  const lastStop = route.segments[route.segments.length - 1].toStop;

  return (
    <Card
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <Card.Content style={styles.cardHeader}>
        <View style={styles.headerTop}>
          <View style={[styles.routeNumber, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {index + 1}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerRow}>
              <Text variant="titleSmall" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
                {firstStop.name} → {lastStop.name}
              </Text>
              {onSave && (
                <IconButton
                  icon={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  iconColor={isSaved ? theme.colors.accent : theme.colors.onSurfaceVariant}
                  onPress={() => onSave(route)}
                  style={styles.saveButton}
                />
              )}
            </View>
            <View style={styles.badges}>
              <Chip
                compact
                mode="flat"
                icon="clock-outline"
                textStyle={styles.chipText}
                style={{ backgroundColor: theme.colors.primaryContainer }}
              >
                ~{route.totalTime} min
              </Chip>
              {route.transferCount > 0 ? (
                <Chip
                  compact
                  mode="flat"
                  icon="swap-horizontal"
                  textStyle={styles.chipText}
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                >
                  {route.transferCount} transfer{route.transferCount > 1 ? 's' : ''}
                </Chip>
              ) : (
                <Chip
                  compact
                  mode="flat"
                  icon="check-circle"
                  textStyle={styles.chipText}
                  style={{ backgroundColor: theme.colors.tertiaryContainer }}
                >
                  Direct
                </Chip>
              )}
            </View>
          </View>
        </View>

        {/* Quick Overview (always visible) */}
        <View style={styles.quickOverview}>
          {route.segments.map((seg, i) => (
            <React.Fragment key={i}>
              {i === 0 && (
                <View style={[styles.stopDot, { backgroundColor: theme.colors.primary }]} />
              )}
              <View style={[styles.segmentLine, {
                backgroundColor: seg.transportType === 'bus' ? theme.colors.bus : theme.colors.taxi,
              }]} />
              {i < route.segments.length - 1 && (
                <View style={[styles.transferDot, { backgroundColor: theme.colors.accent, borderColor: theme.colors.surface }]} />
              )}
              {i === route.segments.length - 1 && (
                <View style={[styles.stopDot, { backgroundColor: theme.colors.success }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </Card.Content>

      {/* Expanded Details */}
      {expanded && (
        <>
          <Divider />
          <Card.Content style={styles.details}>
            {route.segments.map((seg, i) => (
              <View key={i} style={styles.segmentDetail}>
                {/* From stop */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotContainer}>
                    <View style={[styles.timelineDot, {
                      backgroundColor: i === 0 ? theme.colors.primary : theme.colors.accent,
                    }]} />
                    <View style={[styles.timelineLineVertical, {
                      backgroundColor: seg.transportType === 'bus' ? theme.colors.bus : theme.colors.taxi,
                    }]} />
                  </View>
                  <View style={styles.segmentInfo}>
                    <Text variant="titleSmall">{seg.fromStop.name}</Text>
                    <View style={styles.segmentMeta}>
                      <Chip
                        compact
                        mode="flat"
                        icon={seg.transportType === 'bus' ? 'bus' : 'taxi'}
                        textStyle={{ fontSize: 10, color: seg.transportType === 'bus' ? theme.colors.bus : theme.colors.taxi }}
                        style={{ backgroundColor: seg.transportType === 'bus' ? theme.colors.busLight : theme.colors.taxiLight }}
                      >
                        {seg.transportType === 'bus' ? 'Bus' : 'Taxi'}
                      </Chip>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        ~{seg.estimatedTime} min
                      </Text>
                    </View>
                    {seg.isPassingBy && (
                      <Chip
                        compact
                        mode="flat"
                        icon="hand-wave-outline"
                        textStyle={{ fontSize: 10, color: theme.colors.accent }}
                        style={[styles.passingByChip, { backgroundColor: theme.colors.accentLight }]}
                      >
                        Flag down a passing taxi
                      </Chip>
                    )}
                  </View>
                </View>

                {/* To stop (only for last segment) */}
                {i === route.segments.length - 1 && (
                  <View style={styles.timelineRow}>
                    <View style={styles.timelineDotContainer}>
                      <View style={[styles.timelineDot, { backgroundColor: theme.colors.success }]} />
                    </View>
                    <Text variant="titleSmall">{seg.toStop.name}</Text>
                  </View>
                )}
              </View>
            ))}
          </Card.Content>
        </>
      )}

      {/* Expand indicator */}
      <View style={styles.expandIndicator}>
        <Icon
          source={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  cardHeader: {
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    margin: -8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipText: {
    fontSize: 11,
  },
  quickOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  segmentLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  transferDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  details: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  segmentDetail: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 32,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  timelineLineVertical: {
    width: 3,
    flex: 1,
    minHeight: 30,
    borderRadius: 2,
    marginVertical: 2,
  },
  segmentInfo: {
    flex: 1,
    paddingBottom: 16,
    gap: 4,
  },
  segmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passingByChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  expandIndicator: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 4,
  },
});
