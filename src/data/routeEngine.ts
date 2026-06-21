import { CONNECTIONS, getStopById } from './routeData';
import { RouteConnection, RouteResult, RouteSegment } from './types';

interface AdjacencyEntry {
  connection: RouteConnection;
}

function buildGraph(): Map<string, AdjacencyEntry[]> {
  const graph = new Map<string, AdjacencyEntry[]>();

  for (const conn of CONNECTIONS) {
    if (!graph.has(conn.fromStopId)) {
      graph.set(conn.fromStopId, []);
    }
    graph.get(conn.fromStopId)!.push({ connection: conn });

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

let _graph: Map<string, AdjacencyEntry[]> | null = null;
function getGraph(): Map<string, AdjacencyEntry[]> {
  if (!_graph) {
    _graph = buildGraph();
  }
  return _graph;
}

export function resetGraphCache(): void {
  _graph = null;
}

interface BFSState {
  stopId: string;
  path: RouteConnection[];
}

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

  const visitedPaths = new Set<string>();

  while (queue.length > 0 && results.length < maxResults * 3) {
    const current = queue.shift()!;

    if (current.path.length > maxTransfers + 1) continue;

    const neighbors = graph.get(current.stopId) || [];

    for (const neighbor of neighbors) {
      const nextStopId = neighbor.connection.toStopId;

      if (current.path.some(p => p.toStopId === nextStopId) || nextStopId === fromStopId) {
        continue;
      }

      const newPath = [...current.path, neighbor.connection];

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

      if (newPath.length <= maxTransfers + 1) {
        queue.push({ stopId: nextStopId, path: newPath });
      }
    }
  }

  results.sort((a, b) => {
    if (a.transferCount !== b.transferCount) return a.transferCount - b.transferCount;
    return a.totalTime - b.totalTime;
  });

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
  let totalTime = 0;

  for (const conn of path) {
    const fromStop = getStopById(conn.fromStopId);
    const toStop = getStopById(conn.toStopId);

    if (!fromStop || !toStop) return null;

    segments.push({
      fromStop,
      toStop,
      transportType: conn.transportType,
      estimatedTime: conn.estimatedTime,
      isPassingBy: conn.isPassingBy,
    });

    totalTime += conn.estimatedTime;
  }

  const transferCount = Math.max(0, segments.length - 1);
  totalTime += transferCount * 3;

  return {
    id: `route-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    segments,
    totalTime,
    transferCount,
  };
}
