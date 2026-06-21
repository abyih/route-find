/**
 * Hook for managing saved/favorite routes with AsyncStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoute } from '@/data/types';

const STORAGE_KEY = '@saved_routes';

interface SavedRoutesContextType {
  savedRoutes: SavedRoute[];
  isLoaded: boolean;
  saveRoute: (route: SavedRoute) => Promise<void>;
  removeRoute: (routeId: string) => Promise<void>;
  isRouteSaved: (fromStopId: string, toStopId: string) => boolean;
  reload: () => Promise<void>;
}

const SavedRoutesContext = createContext<SavedRoutesContextType | undefined>(undefined);

export function SavedRoutesProvider({ children }: { children: React.ReactNode }) {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSavedRoutes = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedRoutes(JSON.parse(data));
      } else {
        setSavedRoutes([]);
      }
    } catch {
      // Silently fail — user won't lose functionality
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Load saved routes from storage on mount
  useEffect(() => {
    loadSavedRoutes();
  }, [loadSavedRoutes]);

  const saveRoute = useCallback(async (route: SavedRoute) => {
    try {
      setSavedRoutes(prev => {
        const updated = [route, ...prev.filter(r => r.id !== route.id)];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });
    } catch {
      // Silently fail
    }
  }, []);

  const removeRoute = useCallback(async (routeId: string) => {
    try {
      setSavedRoutes(prev => {
        const updated = prev.filter(r => r.id !== routeId);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });
    } catch {
      // Silently fail
    }
  }, []);

  const isRouteSaved = useCallback((fromStopId: string, toStopId: string) => {
    return savedRoutes.some(r => r.fromStopId === fromStopId && r.toStopId === toStopId);
  }, [savedRoutes]);

  return (
    <SavedRoutesContext.Provider
      value={{
        savedRoutes,
        isLoaded,
        saveRoute,
        removeRoute,
        isRouteSaved,
        reload: loadSavedRoutes,
      }}
    >
      {children}
    </SavedRoutesContext.Provider>
  );
}

export function useSavedRoutes() {
  const context = useContext(SavedRoutesContext);
  if (context === undefined) {
    throw new Error('useSavedRoutes must be used within a SavedRoutesProvider');
  }
  return context;
}
