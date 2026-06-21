export type TransportType = 'taxi' | 'bus' | 'both';

export interface Stop {
  id: string;
  name: string;
  type: TransportType;
  isPassingBy?: boolean;
  note?: string;
}

export interface RouteConnection {
  fromStopId: string;
  toStopId: string;
  transportType: TransportType;
  estimatedTime: number;
  isPassingBy?: boolean;
}

export interface RouteSegment {
  fromStop: Stop;
  toStop: Stop;
  transportType: TransportType;
  estimatedTime: number;
  isPassingBy?: boolean;
}

export interface RouteResult {
  id: string;
  segments: RouteSegment[];
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
