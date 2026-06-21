import { SavedRoute } from '@/data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadSavedRoutes();
  }, [loadSavedRoutes]);

  const saveRoute = useCallback(async (route: SavedRoute) => {
    try {
      setSavedRoutes(prev => {
        const updated = [route, ...prev.filter(r => r.id !== route.id)];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => { });
        return updated;
      });
    } catch {
    }
  }, []);

  const removeRoute = useCallback(async (routeId: string) => {
    try {
      setSavedRoutes(prev => {
        const updated = prev.filter(r => r.id !== routeId);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => { });
        return updated;
      });
    } catch {
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
