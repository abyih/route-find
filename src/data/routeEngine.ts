/**
 * Route Finding Engine
 *
 * Uses BFS (Breadth-First Search) to find all possible routes
 * between two stops, including multi-transfer routes.
 *
 * Routes are ranked by:
 *   1. Fewest transfers
 *   2. Shortest estimated time
 *   3. Lowest fare
 */

import { CONNECTIONS, getStopById } from './routeData';
import { RouteConnection, RouteResult, RouteSegment } from './types';

// Build adjacency list for the graph
interface AdjacencyEntry {
  connection: RouteConnection;
}

function buildGraph(): Map<string, AdjacencyEntry[]> {
  const graph = new Map<string, AdjacencyEntry[]>();

  for (const conn of CONNECTIONS) {
    // Add forward direction
    if (!graph.has(conn.fromStopId)) {
      graph.set(conn.fromStopId, []);
    }
    graph.get(conn.fromStopId)!.push({ connection: conn });

    // Add reverse direction (most taxi routes are bidirectional)
    // We create a reversed copy of the connection
    if (!graph.has(conn.toStopId)) {
      graph.set(conn.toStopId, []);
    }
    graph.get(conn.toStopId)!.push({
      connection: {
        ...conn,
        fromStopId: conn.toStopId,
        toStopId: conn.fromStopId,
      },
    });
  }

  return graph;
}

// Singleton graph instance
let _graph: Map<string, AdjacencyEntry[]> | null = null;
function getGraph(): Map<string, AdjacencyEntry[]> {
  if (!_graph) {
    _graph = buildGraph();
  }
  return _graph;
}

/** Reset the graph cache (call after modifying route data) */
export function resetGraphCache(): void {
  _graph = null;
}

interface BFSState {
  stopId: string;
  path: RouteConnection[];
}

/**
 * Find routes between two stops using BFS.
 *
 * @param fromStopId - Starting stop ID
 * @param toStopId - Destination stop ID
 * @param maxTransfers - Maximum number of transfers allowed (default: 3)
 * @param maxResults - Maximum number of routes to return (default: 5)
 * @returns Array of RouteResult objects, sorted by quality
 */
export function findRoutes(
  fromStopId: string,
  toStopId: string,
  maxTransfers: number = 3,
  maxResults: number = 5
): RouteResult[] {
  if (fromStopId === toStopId) return [];

  const graph = getGraph();
  const results: RouteResult[] = [];
  const queue: BFSState[] = [{ stopId: fromStopId, path: [] }];

  // Track visited stops to avoid infinite loops within a single path
  // But we allow revisiting stops across different paths
  const visitedPaths = new Set<string>();

  while (queue.length > 0 && results.length < maxResults * 3) {
    const current = queue.shift()!;

    // If we've made too many transfers, skip
    if (current.path.length > maxTransfers + 1) continue;

    const neighbors = graph.get(current.stopId) || [];

    for (const neighbor of neighbors) {
      const nextStopId = neighbor.connection.toStopId;

      // Don't revisit stops already in the current path
      if (current.path.some(p => p.toStopId === nextStopId) || nextStopId === fromStopId) {
        continue;
      }

      const newPath = [...current.path, neighbor.connection];

      // Found the destination!
      if (nextStopId === toStopId) {
        const pathKey = newPath.map(p => `${p.fromStopId}-${p.toStopId}`).join('|');
        if (!visitedPaths.has(pathKey)) {
          visitedPaths.add(pathKey);
          const routeResult = buildRouteResult(newPath);
          if (routeResult) {
            results.push(routeResult);
          }
        }
        continue;
      }

      // Continue searching if we haven't exceeded max transfers
      if (newPath.length <= maxTransfers + 1) {
        queue.push({ stopId: nextStopId, path: newPath });
      }
    }
  }

  // Sort results: fewer transfers → less time → lower fare
  results.sort((a, b) => {
    if (a.transferCount !== b.transferCount) return a.transferCount - b.transferCount;
    if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
    return a.totalFare - b.totalFare;
  });

  // Deduplicate similar routes (same stops in same order)
  const seen = new Set<string>();
  const unique = results.filter(r => {
    const key = r.segments.map(s => s.fromStop.id + '->' + s.toStop.id).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, maxResults);
}

function buildRouteResult(path: RouteConnection[]): RouteResult | null {
  const segments: RouteSegment[] = [];
  let totalFare = 0;
  let totalTime = 0;

  for (const conn of path) {
    const fromStop = getStopById(conn.fromStopId);
    const toStop = getStopById(conn.toStopId);

    if (!fromStop || !toStop) return null;

    segments.push({
      fromStop,
      toStop,
      transportType: conn.transportType,
      estimatedFare: conn.estimatedFare,
      estimatedTime: conn.estimatedTime,
      isPassingBy: conn.isPassingBy,
    });

    totalFare += conn.estimatedFare;
    totalTime += conn.estimatedTime;
  }

  // Add ~3 minutes for each transfer (waiting time)
  const transferCount = Math.max(0, segments.length - 1);
  totalTime += transferCount * 3;

  return {
    id: `route-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    segments,
    totalFare,
    totalTime,
    transferCount,
  };
}

/**
 * Get nearby stops to a given coordinate.
 * Uses simple Euclidean distance (sufficient for city-scale).
 */
export function getNearbyStops(
  latitude: number,
  longitude: number,
  maxDistanceKm: number = 2
): Array<{ stop: import('./types').Stop; distanceKm: number }> {
  const allStops = require('./routeData').STOPS as import('./types').Stop[];
  const results: Array<{ stop: import('./types').Stop; distanceKm: number }> = [];

  for (const stop of allStops) {
    const distKm = haversineDistance(latitude, longitude, stop.latitude, stop.longitude);
    if (distKm <= maxDistanceKm) {
      results.push({ stop, distanceKm: Math.round(distKm * 100) / 100 });
    }
  }

  results.sort((a, b) => a.distanceKm - b.distanceKm);
  return results;
}

/** Haversine distance in kilometers */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
