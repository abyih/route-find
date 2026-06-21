/**
 * RouteCard — Displays a route search result
 *
 * Shows a visual timeline of segments with transfer indicators,
 * time badges, and an expandable detail view.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteResult } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface RouteCardProps {
  route: RouteResult;
  index: number;
  onSave?: (route: RouteResult) => void;
  isSaved?: boolean;
}

export function RouteCard({ route, index, onSave, isSaved }: RouteCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const firstStop = route.segments[0].fromStop;
  const lastStop = route.segments[route.segments.length - 1].toStop;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.routeNumber, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.routeNumberText, { color: theme.primary }]}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={[styles.routeTitle, { color: theme.text }]} numberOfLines={1}>
              {firstStop.name} → {lastStop.name}
            </Text>
            {onSave && (
              <TouchableOpacity onPress={() => onSave(route)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? theme.accent : theme.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="time-outline" size={12} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>~{route.totalTime} min</Text>
            </View>
            {route.transferCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
                <Ionicons name="swap-horizontal" size={12} color={theme.accent} />
                <Text style={[styles.badgeText, { color: theme.accent }]}>
                  {route.transferCount} transfer{route.transferCount > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            {route.transferCount === 0 && (
              <View style={[styles.badge, { backgroundColor: theme.successLight }]}>
                <Ionicons name="checkmark-circle" size={12} color={theme.success} />
                <Text style={[styles.badgeText, { color: theme.success }]}>Direct</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Quick Overview (always visible) */}
      <View style={styles.quickOverview}>
        {route.segments.map((seg, i) => (
          <React.Fragment key={i}>
            {i === 0 && (
              <View style={[styles.stopDot, { backgroundColor: theme.primary }]} />
            )}
            <View style={[styles.segmentLine, {
              backgroundColor: seg.transportType === 'bus' ? theme.bus : theme.taxi
            }]} />
            {i < route.segments.length - 1 && (
              <View style={[styles.transferDot, { backgroundColor: theme.accent, borderColor: theme.card }]} />
            )}
            {i === route.segments.length - 1 && (
              <View style={[styles.stopDot, { backgroundColor: theme.success }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Expanded Details */}
      {expanded && (
        <View style={[styles.details, { borderTopColor: theme.border }]}>
          {route.segments.map((seg, i) => (
            <View key={i} style={styles.segmentDetail}>
              {/* From stop */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineDotContainer}>
                  <View style={[styles.timelineDot, {
                    backgroundColor: i === 0 ? theme.primary : theme.accent,
                  }]} />
                  <View style={[styles.timelineLineVertical, {
                    backgroundColor: seg.transportType === 'bus' ? theme.bus : theme.taxi,
                  }]} />
                </View>
                <View style={styles.segmentInfo}>
                  <Text style={[styles.segmentStopName, { color: theme.text }]}>
                    {seg.fromStop.name}
                  </Text>
                  <View style={styles.segmentMeta}>
                    <View style={[styles.transportBadge, {
                      backgroundColor: seg.transportType === 'bus' ? theme.busLight : theme.taxiLight,
                    }]}>
                      <Ionicons
                        name={seg.transportType === 'bus' ? 'bus' : 'car'}
                        size={10}
                        color={seg.transportType === 'bus' ? theme.bus : theme.taxi}
                      />
                      <Text style={[styles.transportText, {
                        color: seg.transportType === 'bus' ? theme.bus : theme.taxi,
                      }]}>
                        {seg.transportType === 'bus' ? 'Bus' : 'Taxi'}
                      </Text>
                    </View>
                    <Text style={[styles.segmentMetaText, { color: theme.textSecondary }]}>
                      ~{seg.estimatedTime} min
                    </Text>
                  </View>
                  {seg.isPassingBy && (
                    <View style={[styles.passingByNote, { backgroundColor: theme.accentLight }]}>
                      <Ionicons name="hand-left-outline" size={12} color={theme.accent} />
                      <Text style={[styles.passingByNoteText, { color: theme.accent }]}>
                        Flag down a passing taxi
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* To stop (only for last segment) */}
              {i === route.segments.length - 1 && (
                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotContainer}>
                    <View style={[styles.timelineDot, { backgroundColor: theme.success }]} />
                  </View>
                  <Text style={[styles.segmentStopName, { color: theme.text }]}>
                    {seg.toStop.name}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Expand indicator */}
      <View style={styles.expandIndicator}>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.three,
    gap: 12,
  },
  routeNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeNumberText: {
    fontSize: 14,
    fontWeight: '700',
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
  routeTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: 4,
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
    borderTopWidth: 1,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
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
  segmentStopName: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 3,
  },
  transportText: {
    fontSize: 10,
    fontWeight: '600',
  },
  segmentMetaText: {
    fontSize: 12,
  },
  passingByNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  passingByNoteText: {
    fontSize: 11,
    fontWeight: '500',
  },
  expandIndicator: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 4,
  },
});
