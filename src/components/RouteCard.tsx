import { RouteResult } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  Text,
} from 'react-native-paper';

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
      mode="outlined"
      onPress={() => setExpanded(!expanded)}
      style={{ marginBottom: 12 }}
    >
      <Card.Content style={{ gap: 12, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primaryContainer }}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {index + 1}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, flex: 1, marginRight: 8 }}>
                <Text variant="titleSmall" style={{ fontWeight: '700', flexShrink: 1 }}>{firstStop.name}</Text>
                <Icon source="arrow-right" size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleSmall" style={{ fontWeight: '700', flexShrink: 1 }}>{lastStop.name}</Text>
              </View>
              {onSave && (
                <IconButton
                  icon={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  iconColor={isSaved ? theme.colors.accent : theme.colors.onSurfaceVariant}
                  onPress={() => onSave(route)}
                  style={{ margin: -8 }}
                />
              )}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {route.transferCount > 0 ? (
                <Chip
                  compact
                  mode="flat"
                  icon="swap-horizontal"
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                >
                  {route.transferCount} transfer{route.transferCount > 1 ? 's' : ''}
                </Chip>
              ) : (
                <Chip
                  compact
                  mode="flat"
                  icon="check-circle"
                  style={{ backgroundColor: theme.colors.tertiaryContainer }}
                >
                  Direct
                </Chip>
              )}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 4 }}>
          {route.segments.map((seg, i) => (
            <View key={i} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {i === 0 && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary }} />
              )}
              <View style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: seg.transportType === 'bus' ? theme.colors.bus : theme.colors.taxi,
              }} />
              {i < route.segments.length - 1 && (
                <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.colors.surface, backgroundColor: theme.colors.accent }} />
              )}
              {i === route.segments.length - 1 && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.success }} />
              )}
            </View>
          ))}
        </View>
      </Card.Content>

      {/* Expanded Details */}
      {expanded && (
        <>
          <Divider />
          <Card.Content style={{ paddingTop: 16, paddingBottom: 8 }}>
            {route.segments.map((seg, i) => (
              <View key={i}>
                {/* From stop */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 32 }}>
                  <View style={{ alignItems: 'center', width: 16 }}>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      marginTop: 3,
                      backgroundColor: i === 0 ? theme.colors.primary : theme.colors.accent,
                    }} />
                    <View style={{
                      width: 3,
                      flex: 1,
                      minHeight: 30,
                      borderRadius: 2,
                      marginVertical: 2,
                      backgroundColor: seg.transportType === 'bus' ? theme.colors.bus : theme.colors.taxi,
                    }} />
                  </View>
                  <View style={{ flex: 1, paddingBottom: 16, gap: 4 }}>
                    <Text variant="titleSmall">{seg.fromStop.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Chip
                        compact
                        mode="outlined"
                      >
                        {seg.transportType === 'bus' ? '🚌 Bus' : '🚕 Taxi'}
                      </Chip>
                    </View>
                  </View>
                </View>

                {/* To stop (only for last segment) */}
                {i === route.segments.length - 1 && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 32 }}>
                    <View style={{ alignItems: 'center', width: 16 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.success }} />
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
      <View style={{ alignItems: 'center', paddingBottom: 8, paddingTop: 4 }}>
        <Icon
          source={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
    </Card>
  );
}
