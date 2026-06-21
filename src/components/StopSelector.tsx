/**
 * StopSelector — Searchable dropdown for selecting transit stops
 *
 * Features:
 * - Fuzzy text search via Paper Searchbar
 * - Portal-based modal presentation
 * - Shows stop type (bus/taxi) with Paper Chips
 * - Notes for passing-by stops
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Portal,
  Modal,
  Searchbar,
  Text,
  TouchableRipple,
  Surface,
  Chip,
  Icon,
  IconButton,
  Divider,
} from 'react-native-paper';
import { getAllStopsSorted } from '@/data/routeData';
import { Stop } from '@/data/types';
import { useAppTheme } from '@/hooks/use-theme';

interface StopSelectorProps {
  label: string;
  placeholder: string;
  selectedStop: Stop | null;
  onSelect: (stop: Stop) => void;
  icon: string;
}

export function StopSelector({ label, placeholder, selectedStop, onSelect, icon }: StopSelectorProps) {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const allStops = useMemo(() => getAllStopsSorted(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allStops;
    const q = search.toLowerCase();
    return allStops.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  }, [search, allStops]);

  const handleSelect = useCallback((stop: Stop) => {
    onSelect(stop);
    setVisible(false);
    setSearch('');
  }, [onSelect]);

  const getStopIcon = (type: string) => {
    if (type === 'bus') return 'bus';
    if (type === 'taxi') return 'taxi';
    return 'swap-horizontal';
  };

  const getStopColor = (type: string) => {
    if (type === 'bus') return theme.colors.bus;
    if (type === 'taxi') return theme.colors.taxi;
    return theme.colors.primary;
  };

  const getStopBg = (type: string) => {
    if (type === 'bus') return theme.colors.busLight;
    if (type === 'taxi') return theme.colors.taxiLight;
    return theme.colors.primaryLight;
  };

  const renderStop = useCallback(({ item }: { item: Stop }) => (
    <TouchableRipple onPress={() => handleSelect(item)} style={styles.stopItem}>
      <View style={styles.stopItemInner}>
        <View style={styles.stopItemLeft}>
          <View style={[styles.stopTypeBadge, { backgroundColor: getStopBg(item.type) }]}>
            <Icon source={getStopIcon(item.type)} size={16} color={getStopColor(item.type)} />
          </View>
          <View style={styles.stopItemText}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {item.name}
            </Text>
            {item.note && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
                {item.note}
              </Text>
            )}
          </View>
        </View>
        {item.isPassingBy && (
          <Chip
            compact
            mode="flat"
            textStyle={{ fontSize: 10, color: theme.colors.accent }}
            style={{ backgroundColor: theme.colors.accentLight }}
          >
            Flag down
          </Chip>
        )}
      </View>
    </TouchableRipple>
  ), [theme, handleSelect]);

  return (
    <>
      <TouchableRipple
        onPress={() => setVisible(true)}
        style={[styles.selector, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
        borderless
      >
        <View style={styles.selectorInner}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <Icon source={icon} size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.selectorTextContainer}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {label}
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: selectedStop ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {selectedStop?.name || placeholder}
            </Text>
          </View>
          <Icon source="chevron-down" size={18} color={theme.colors.onSurfaceVariant} />
        </View>
      </TouchableRipple>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => { setVisible(false); setSearch(''); }}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalInner}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text variant="titleMedium">{label}</Text>
              <IconButton
                icon="close-circle"
                size={24}
                onPress={() => { setVisible(false); setSearch(''); }}
              />
            </View>

            <Divider />

            {/* Search */}
            <Searchbar
              placeholder="Search stops..."
              value={search}
              onChangeText={setSearch}
              style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
              autoFocus
            />

            {/* Stop List */}
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              renderItem={renderStop}
              style={styles.stopList}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={Divider}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon source="alert-circle-outline" size={48} color={theme.colors.onSurfaceVariant} />
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                    No stops found for "{search}"
                  </Text>
                </View>
              }
            />
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  selectorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorTextContainer: {
    flex: 1,
    gap: 2,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalInner: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 0,
  },
  stopList: {
    flex: 1,
  },
  stopItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  stopItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  stopTypeBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopItemText: {
    flex: 1,
    gap: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
});
