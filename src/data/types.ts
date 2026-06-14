/**
 * Core type definitions for the Addis Ababa Route Finder app.
 */

export type TransportType = 'taxi' | 'bus' | 'both';

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: TransportType;
  /** If true, there's no fixed station — you flag down passing vehicles */
  isPassingBy?: boolean;
  /** Short description or note about this stop */
  note?: string;
}

export interface RouteConnection {
  fromStopId: string;
  toStopId: string;
  transportType: TransportType;
  /** Estimated fare in ETB */
  estimatedFare: number;
  /** Estimated travel time in minutes */
  estimatedTime: number;
  /** If true, requires flagging a passing vehicle (no fixed stop) */
  isPassingBy?: boolean;
}

export interface RouteSegment {
  fromStop: Stop;
  toStop: Stop;
  transportType: TransportType;
  estimatedFare: number;
  estimatedTime: number;
  isPassingBy?: boolean;
}

export interface RouteResult {
  id: string;
  segments: RouteSegment[];
  totalFare: number;
  totalTime: number;
  transferCount: number;
}

export interface SavedRoute {
  id: string;
  fromStopId: string;
  toStopId: string;
  fromStopName: string;
  toStopName: string;
  savedAt: number;
}
