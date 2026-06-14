/**
 * StopSelector — Searchable dropdown for selecting transit stops
 *
 * Features:
 * - Fuzzy text search
 * - Modal presentation
 * - Shows stop type (bus/taxi) with colored badges
 * - Notes for passing-by stops
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllStopsSorted } from '@/data/routeData';
import { Stop } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface StopSelectorProps {
  label: string;
  placeholder: string;
  selectedStop: Stop | null;
  onSelect: (stop: Stop) => void;
  icon: keyof typeof Ionicons.glyphMap;
}

export function StopSelector({ label, placeholder, selectedStop, onSelect, icon }: StopSelectorProps) {
  const theme = useTheme();
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

  const renderStop = useCallback(({ item }: { item: Stop }) => (
    <TouchableOpacity
      style={[styles.stopItem, { borderBottomColor: theme.border }]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.stopItemLeft}>
        <View style={[
          styles.stopTypeBadge,
          { backgroundColor: item.type === 'bus' ? theme.busLight : item.type === 'taxi' ? theme.taxiLight : theme.primaryLight }
        ]}>
          <Ionicons
            name={item.type === 'bus' ? 'bus' : item.type === 'taxi' ? 'car' : 'swap-horizontal'}
            size={14}
            color={item.type === 'bus' ? theme.bus : item.type === 'taxi' ? theme.taxi : theme.primary}
          />
        </View>
        <View style={styles.stopItemText}>
          <Text style={[styles.stopName, { color: theme.text }]}>{item.name}</Text>
          {item.note && (
            <Text style={[styles.stopNote, { color: theme.textSecondary }]} numberOfLines={1}>{item.note}</Text>
          )}
        </View>
      </View>
      {item.isPassingBy && (
        <View style={[styles.passingByBadge, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.passingByText, { color: theme.accent }]}>Flag down</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [theme, handleSelect]);

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name={icon} size={18} color={theme.primary} />
        </View>
        <View style={styles.selectorTextContainer}>
          <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>{label}</Text>
          <Text
            style={[
              styles.selectorValue,
              { color: selectedStop ? theme.text : theme.textSecondary },
            ]}
            numberOfLines={1}
          >
            {selectedStop?.name || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{label}</Text>
              <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }}>
                <Ionicons name="close-circle" size={28} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Ionicons name="search" size={18} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search stops..."
                placeholderTextColor={theme.textSecondary}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Stop List */}
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              renderItem={renderStop}
              style={styles.stopList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No stops found for "{search}"
                  </Text>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorTextContainer: {
    flex: 1,
    gap: 2,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginVertical: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 4 }),
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.select({ ios: 0, android: 6 }),
  },
  stopList: {
    flex: 1,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  stopName: {
    fontSize: 15,
    fontWeight: '500',
  },
  stopNote: {
    fontSize: 12,
  },
  passingByBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  passingByText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
