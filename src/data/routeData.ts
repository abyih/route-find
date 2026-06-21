import { RouteConnection, Stop } from './types';

export const STOPS: Stop[] = [
  { id: 'mexico', name: 'Mexico', type: 'both' },
  { id: 'piassa', name: 'Piassa', type: 'both' },
  { id: 'megenagna', name: 'Megenagna', type: 'both' },
  { id: 'bole', name: 'Bole', type: 'both' },
  { id: 'merkato', name: 'Merkato', type: 'both' },
  { id: 'tor_hayloch', name: 'Tor Hayloch', type: 'both' },
  { id: 'jemmo', name: 'Jemmo', type: 'taxi' },

  { id: '4kilo', name: '4 Kilo (Arat Kilo)', type: 'both' },
  { id: '6kilo', name: '6 Kilo', type: 'taxi', isPassingBy: true, note: 'No dedicated station — flag down passing taxis' },
  { id: '5kilo', name: '5 Kilo', type: 'taxi', isPassingBy: true, note: 'No dedicated station — flag down passing taxis' },
  { id: 'shiromeda', name: 'Shiromeda', type: 'taxi' },
  { id: 'ferensay', name: 'Ferensay', type: 'taxi' },
  { id: 'stadium', name: 'Stadium', type: 'taxi' },
  { id: 'kasanchis', name: 'Kasanchis', type: 'taxi' },

  { id: 'lideta', name: 'Lideta', type: 'taxi' },
  { id: 'ayer_tena', name: 'Ayer Tena', type: 'taxi' },
  { id: 'kera', name: 'Kera', type: 'taxi' },
  { id: 'gofa', name: 'Gofa', type: 'taxi' },
  { id: 'saris', name: 'Saris', type: 'both' },
  { id: 'saris_abo', name: 'Saris (Abo)', type: 'taxi' },
  { id: 'kaliti', name: 'Kaliti', type: 'both' },
  { id: 'tulu_dimtu', name: 'Tulu Dimtu', type: 'both' },
  { id: 'alembank', name: 'Alembank', type: 'taxi' },
  { id: 'bethel', name: 'Bethel', type: 'taxi' },
  { id: 'kara_kore', name: 'Kara Kore', type: 'taxi' },
  { id: 'kolfe', name: 'Kolfe', type: 'taxi' },
  { id: 'zenebe_work', name: 'Zenebe Work', type: 'taxi' },

  { id: 'mekanissa', name: 'Mekanissa', type: 'taxi' },
  { id: 'garment', name: 'Garment', type: 'taxi' },
  { id: 'sarbet', name: 'Sarbet', type: 'taxi' },
  { id: 'bulbula', name: 'Bulbula', type: 'taxi' },
  { id: 'hana_mariam', name: 'Hana Mariam', type: 'taxi' },

  { id: 'ayat', name: 'Ayat', type: 'taxi' },
  { id: 'semit', name: 'Semit', type: 'taxi' },
  { id: 'kotebe', name: 'Kotebe', type: 'taxi' },
  { id: 'cmc', name: 'CMC', type: 'taxi' },
  { id: 'gurd_shola', name: 'Gurd Shola', type: 'taxi' },

  { id: 'atikilt_tera', name: 'Atikilt Tera', type: 'taxi' },
  { id: 'asko', name: 'Asko', type: 'taxi' },
  { id: 'paulos', name: 'Paulos', type: 'taxi' },
  { id: 'gebya', name: 'Gebya', type: 'taxi' },
  { id: 'mesfin', name: 'Mesfin', type: 'taxi' },
  { id: 'autobis_tera', name: 'Autobis Tera', type: 'bus' },

  { id: 'sebeta', name: 'Sebeta', type: 'bus' },
  { id: 'noc', name: 'NOC', type: 'taxi' },
  { id: 'furi', name: 'Furi', type: 'taxi' },
  { id: 'bisrate_gabriel', name: 'Bisrate Gabriel', type: 'taxi', isPassingBy: true, note: 'When there is a taxi passing by' },

  { id: 'yeka_abado', name: 'Yeka Abado', type: 'taxi' },
  { id: 'arabsa', name: 'Arabsa', type: 'taxi' },
  { id: '22_mazoria', name: '22 (Mazoria)', type: 'taxi' },
];

export const CONNECTIONS: RouteConnection[] = [
  { fromStopId: 'mexico', toStopId: 'sarbet', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'mekanissa', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'garment', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'tulu_dimtu', transportType: 'bus', estimatedTime: 35 },
  { fromStopId: 'mexico', toStopId: 'lideta', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'kara_kore', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'alembank', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'mexico', toStopId: 'bethel', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'mexico', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'mexico', toStopId: '4kilo', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'kera', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 12 },

  { fromStopId: '4kilo', toStopId: 'mexico', transportType: 'bus', estimatedTime: 15 },
  { fromStopId: '4kilo', toStopId: '22_mazoria', transportType: 'bus', estimatedTime: 8 },
  { fromStopId: '4kilo', toStopId: 'megenagna', transportType: 'bus', estimatedTime: 15 },
  { fromStopId: '4kilo', toStopId: 'bole', transportType: 'bus', estimatedTime: 18 },

  { fromStopId: '4kilo', toStopId: '6kilo', transportType: 'taxi', estimatedTime: 5 },
  { fromStopId: '4kilo', toStopId: 'shiromeda', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: '4kilo', toStopId: 'ferensay', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: '4kilo', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: '4kilo', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 8 },

  { fromStopId: '6kilo', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 12, isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'shiromeda', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'ferensay', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 12, isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'shiromeda', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'ferensay', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },

  { fromStopId: 'piassa', toStopId: 'kera', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'piassa', toStopId: 'bole', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'piassa', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'piassa', toStopId: 'saris', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'atikilt_tera', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 5 },
  { fromStopId: 'gebya', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 5 },
  { fromStopId: 'paulos', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'asko', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'mesfin', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 5 },

  { fromStopId: 'garment', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'saris', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'jemmo', toStopId: 'tulu_dimtu', transportType: 'taxi', estimatedTime: 25 },
  { fromStopId: 'jemmo', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'jemmo', toStopId: 'autobis_tera', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'jemmo', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'jemmo', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'jemmo', toStopId: 'gofa', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'kera', transportType: 'taxi', estimatedTime: 10 },

  { fromStopId: 'jemmo', toStopId: 'lideta', transportType: 'taxi', estimatedTime: 12, isPassingBy: true },
  { fromStopId: 'lideta', toStopId: 'autobis_tera', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'lideta', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'lideta', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'lideta', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'lideta', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'lideta', toStopId: 'bethel', transportType: 'taxi', estimatedTime: 15 },

  { fromStopId: 'megenagna', toStopId: 'bole', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'megenagna', toStopId: 'kasanchis', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'megenagna', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'megenagna', toStopId: 'ayat', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'megenagna', toStopId: 'semit', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'megenagna', toStopId: 'saris_abo', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'hana_mariam', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'garment', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'tulu_dimtu', transportType: 'taxi', estimatedTime: 30 },
  { fromStopId: 'megenagna', toStopId: 'kaliti', transportType: 'taxi', estimatedTime: 25 },
  { fromStopId: 'megenagna', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'kotebe', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'kasanchis', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'kasanchis', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 8 },

  { fromStopId: 'bole', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'bole', toStopId: 'ayat', transportType: 'taxi', estimatedTime: 25 },
  { fromStopId: 'bole', toStopId: 'semit', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'bole', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'bole', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'bole', toStopId: 'autobis_tera', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'bole', toStopId: 'kaliti', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'bole', toStopId: 'saris_abo', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'bole', toStopId: 'bulbula', transportType: 'taxi', estimatedTime: 18 },

  { fromStopId: 'tor_hayloch', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'tor_hayloch', toStopId: 'lideta', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'tor_hayloch', toStopId: '4kilo', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'tor_hayloch', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'tor_hayloch', toStopId: 'ayat', transportType: 'taxi', estimatedTime: 45 },
  { fromStopId: 'ayer_tena', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'kera', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'bethel', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'alembank', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'kolfe', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'zenebe_work', toStopId: 'tor_hayloch', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'tor_hayloch', toStopId: 'stadium', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'tor_hayloch', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 30 },

  { fromStopId: 'bisrate_gabriel', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 10, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 8, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 10, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 15, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'merkato', transportType: 'taxi', estimatedTime: 15, isPassingBy: true },

  { fromStopId: 'sebeta', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 25 },
  { fromStopId: 'noc', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'furi', toStopId: 'jemmo', transportType: 'taxi', estimatedTime: 20 },
  { fromStopId: 'sebeta', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 30 },
  { fromStopId: 'furi', toStopId: 'ayer_tena', transportType: 'taxi', estimatedTime: 25 },

  { fromStopId: 'yeka_abado', toStopId: 'ayat', transportType: 'taxi', estimatedTime: 15 },
  { fromStopId: 'arabsa', toStopId: 'ayat', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'yeka_abado', toStopId: 'cmc', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'yeka_abado', toStopId: 'kotebe', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: 'yeka_abado', toStopId: 'gurd_shola', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'arabsa', toStopId: 'cmc', transportType: 'taxi', estimatedTime: 8 },

  { fromStopId: 'merkato', toStopId: 'piassa', transportType: 'taxi', estimatedTime: 8 },
  { fromStopId: 'merkato', toStopId: 'autobis_tera', transportType: 'taxi', estimatedTime: 5 },
  { fromStopId: 'merkato', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 12 },

  { fromStopId: 'saris', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 18 },
  { fromStopId: 'gofa', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 12 },
  { fromStopId: 'gofa', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 22 },
  { fromStopId: '22_mazoria', toStopId: 'megenagna', transportType: 'taxi', estimatedTime: 10 },
  { fromStopId: '22_mazoria', toStopId: 'mexico', transportType: 'taxi', estimatedTime: 8 },
];

export function getStopById(id: string): Stop | undefined {
  return STOPS.find(s => s.id === id);
}

export function getAllStopsSorted(): Stop[] {
  return [...STOPS].sort((a, b) => a.name.localeCompare(b.name));
}

export function getConnectionsFrom(stopId: string): RouteConnection[] {
  return CONNECTIONS.filter(c => c.fromStopId === stopId);
}

export function getConnectionsTo(stopId: string): RouteConnection[] {
  return CONNECTIONS.filter(c => c.toStopId === stopId);
}

export function getHubStopIds(): string[] {
  const hubs = new Set<string>();
  for (const c of CONNECTIONS) {
    hubs.add(c.fromStopId);
  }
  return Array.from(hubs);
}
