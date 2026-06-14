/**
 * Hook for managing saved/favorite routes with AsyncStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoute } from '@/data/types';

const STORAGE_KEY = '@saved_routes';

export function useSavedRoutes() {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved routes from storage on mount
  useEffect(() => {
    loadSavedRoutes();
  }, []);

  const loadSavedRoutes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedRoutes(JSON.parse(data));
      }
    } catch {
      // Silently fail — user won't lose functionality
    } finally {
      setIsLoaded(true);
    }
  };

  const saveRoute = useCallback(async (route: SavedRoute) => {
    try {
      const updated = [route, ...savedRoutes.filter(r => r.id !== route.id)];
      setSavedRoutes(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  }, [savedRoutes]);

  const removeRoute = useCallback(async (routeId: string) => {
    try {
      const updated = savedRoutes.filter(r => r.id !== routeId);
      setSavedRoutes(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  }, [savedRoutes]);

  const isRouteSaved = useCallback((fromStopId: string, toStopId: string) => {
    return savedRoutes.some(r => r.fromStopId === fromStopId && r.toStopId === toStopId);
  }, [savedRoutes]);

  return { savedRoutes, isLoaded, saveRoute, removeRoute, isRouteSaved, reload: loadSavedRoutes };
}
