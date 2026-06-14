/**
 * Addis Ababa Public Transportation Route Data
 *
 * This file contains all stop locations and route connections
 * transcribed from manually gathered public transportation data.
 *
 * Coordinates are approximate locations in Addis Ababa.
 * Fares are estimated based on common minibus taxi prices (2024).
 *
 * To edit routes: modify the STOPS and CONNECTIONS arrays below.
 */

import { Stop, RouteConnection } from './types';

// ─── Stop Definitions ───────────────────────────────────────────────────────
// Each stop has approximate GPS coordinates for map display.

export const STOPS: Stop[] = [
  // ── Major Hubs ──
  { id: 'mexico',       name: 'Mexico',         latitude: 9.0107, longitude: 38.7469, type: 'both' },
  { id: 'piassa',       name: 'Piassa',         latitude: 9.0350, longitude: 38.7480, type: 'both' },
  { id: 'megenagna',    name: 'Megenagna',      latitude: 9.0227, longitude: 38.8000, type: 'both' },
  { id: 'bole',         name: 'Bole',           latitude: 9.0120, longitude: 38.7890, type: 'both' },
  { id: 'merkato',      name: 'Merkato',        latitude: 9.0340, longitude: 38.7380, type: 'both' },
  { id: 'torhayloch',   name: 'Torhayloch',     latitude: 8.9960, longitude: 38.7200, type: 'both' },
  { id: 'jemmo',        name: 'Jemmo',          latitude: 9.0000, longitude: 38.7350, type: 'taxi' },

  // ── Central / North ──
  { id: '4kilo',        name: '4 Kilo',         latitude: 9.0350, longitude: 38.7630, type: 'taxi' },
  { id: '6kilo',        name: '6 Kilo',         latitude: 9.0380, longitude: 38.7580, type: 'taxi', isPassingBy: true, note: 'No dedicated station — flag down passing taxis' },
  { id: '5kilo',        name: '5 Kilo',         latitude: 9.0365, longitude: 38.7605, type: 'taxi', isPassingBy: true, note: 'No dedicated station — flag down passing taxis' },
  { id: 'shiromeda',    name: 'Shiromeda',       latitude: 9.0480, longitude: 38.7560, type: 'taxi' },
  { id: 'ferensay',     name: 'Ferensay',       latitude: 9.0420, longitude: 38.7650, type: 'taxi' },
  { id: 'stadium',      name: 'Stadium',         latitude: 9.0210, longitude: 38.7590, type: 'taxi' },
  { id: 'kasanchis',    name: 'Kasanchis',      latitude: 9.0180, longitude: 38.7700, type: 'taxi' },

  // ── West / Southwest ──
  { id: 'lideta',       name: 'Lideta',         latitude: 9.0180, longitude: 38.7380, type: 'taxi' },
  { id: 'aser_tena',    name: 'Aser Tena',      latitude: 8.9930, longitude: 38.7280, type: 'taxi' },
  { id: 'kera',         name: 'Kera',           latitude: 9.0050, longitude: 38.7420, type: 'taxi' },
  { id: 'gofa',         name: 'Gofa',           latitude: 8.9920, longitude: 38.7500, type: 'taxi' },
  { id: 'saris',        name: 'Saris',          latitude: 8.9800, longitude: 38.7580, type: 'both' },
  { id: 'saris_abo',    name: 'Saris (Abo)',    latitude: 8.9780, longitude: 38.7600, type: 'taxi' },
  { id: 'kaliti',       name: 'Kaliti',         latitude: 8.9500, longitude: 38.7530, type: 'both' },
  { id: 'tulu_dimtu',   name: 'Tulu Dimtu',     latitude: 8.9350, longitude: 38.7450, type: 'both' },
  { id: 'alembank',     name: 'Alembank',       latitude: 9.0050, longitude: 38.7150, type: 'taxi' },
  { id: 'bethel',       name: 'Bethel',         latitude: 8.9990, longitude: 38.7100, type: 'taxi' },
  { id: 'kara_kore',    name: 'Kara Kore',      latitude: 9.0100, longitude: 38.7230, type: 'taxi' },
  { id: 'korfe',        name: 'Korfe',          latitude: 8.9900, longitude: 38.7080, type: 'taxi' },
  { id: 'zenebe_work',  name: 'Zenebe Work',    latitude: 8.9940, longitude: 38.7050, type: 'taxi' },

  // ── South ──
  { id: 'mekanissa',    name: 'Mekanissa',      latitude: 8.9850, longitude: 38.7250, type: 'taxi' },
  { id: 'garment',      name: 'Garment',        latitude: 8.9950, longitude: 38.7430, type: 'taxi' },
  { id: 'sarbet',       name: 'Sarbet',         latitude: 9.0000, longitude: 38.7400, type: 'taxi' },
  { id: 'sefere',       name: 'Sefere',         latitude: 8.9980, longitude: 38.7380, type: 'taxi' },
  { id: 'temmo',        name: 'Temmo',          latitude: 8.9920, longitude: 38.7320, type: 'taxi' },
  { id: 'bulbula',      name: 'Bulbula',        latitude: 8.9580, longitude: 38.7550, type: 'taxi' },
  { id: 'hana_mariam',  name: 'Hana Mariam',    latitude: 8.9700, longitude: 38.7650, type: 'taxi' },

  // ── East / Northeast ──
  { id: 'ayat',         name: 'Ayat',           latitude: 9.0340, longitude: 38.8450, type: 'taxi' },
  { id: 'semit',        name: 'Semit',          latitude: 9.0280, longitude: 38.8200, type: 'taxi' },
  { id: 'kotebe',       name: 'Kotebe',         latitude: 9.0400, longitude: 38.8100, type: 'taxi' },
  { id: 'cmc',          name: 'CMC',            latitude: 9.0350, longitude: 38.8300, type: 'taxi' },
  { id: 'gurd_shola',   name: 'Gurd Shola',     latitude: 9.0270, longitude: 38.8050, type: 'taxi' },

  // ── Piassa Area ──
  { id: 'arat_kilo',    name: 'Arat Kilo',      latitude: 9.0330, longitude: 38.7620, type: 'both', note: 'Also called Arat — bus terminal' },
  { id: 'atikilt_tera', name: 'Atikilt Tera',   latitude: 9.0380, longitude: 38.7420, type: 'taxi' },
  { id: 'asko',         name: 'Asko',           latitude: 9.0450, longitude: 38.7350, type: 'taxi' },
  { id: 'paulos',       name: 'Paulos',         latitude: 9.0400, longitude: 38.7400, type: 'taxi' },
  { id: 'gebya',        name: 'Gebya',          latitude: 9.0370, longitude: 38.7440, type: 'taxi' },
  { id: 'mesfin',       name: 'Mesfin',         latitude: 9.0360, longitude: 38.7550, type: 'taxi' },
  { id: 'autobis_tera', name: 'Autobis Tera',   latitude: 9.0310, longitude: 38.7350, type: 'bus' },

  // ── Outskirts ──
  { id: 'sebeta',       name: 'Sebeta',         latitude: 8.9200, longitude: 38.6200, type: 'bus' },
  { id: 'noc',          name: 'NOC',            latitude: 8.9350, longitude: 38.6400, type: 'taxi' },
  { id: 'furi',         name: 'Furi',           latitude: 8.9250, longitude: 38.6350, type: 'taxi' },
  { id: 'bisrate_gabriel', name: 'Bisrate Gabriel', latitude: 9.0030, longitude: 38.7350, type: 'taxi', isPassingBy: true, note: 'When there is a taxi passing by' },

  // ── Additional Stops ──
  { id: 'beka_abdo',    name: 'Beka Abdo',      latitude: 9.0400, longitude: 38.8200, type: 'taxi' },
  { id: 'arabsa',       name: 'Arabsa',         latitude: 9.0420, longitude: 38.8350, type: 'taxi' },
  { id: 'marco',        name: 'Marco',          latitude: 9.0150, longitude: 38.7320, type: 'taxi' },
  { id: 'au',           name: 'AU (African Union)', latitude: 9.0190, longitude: 38.7570, type: 'taxi' },
  { id: '22_mazoria',   name: '22 (Mazoria)',    latitude: 9.0250, longitude: 38.7480, type: 'taxi' },
];

// ─── Route Connections ──────────────────────────────────────────────────────
// Bidirectional connections with estimated fares (ETB) and times (minutes).
//
// Fare estimates based on common Addis Ababa minibus taxi prices:
//   Short routes (neighboring stops): 7-10 ETB
//   Medium routes (2-3 stops away):  10-15 ETB
//   Long routes (across city):       15-30 ETB

export const CONNECTIONS: RouteConnection[] = [
  // ── Mexico Hub Routes ──
  { fromStopId: 'mexico', toStopId: 'sarbet',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'mekanissa',    transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'garment',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'temmo',        transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'sefere',       transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'tulu_dimtu',   transportType: 'bus',  estimatedFare: 15, estimatedTime: 35 },
  { fromStopId: 'mexico', toStopId: 'lideta',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'torhayloch',   transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'aser_tena',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'mexico', toStopId: 'kara_kore',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'alembank',     transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'mexico', toStopId: 'bethel',       transportType: 'taxi', estimatedFare: 15, estimatedTime: 20 },
  { fromStopId: 'mexico', toStopId: 'piassa',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'mexico', toStopId: '4kilo',        transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'mexico', toStopId: 'stadium',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'kera',         transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'mexico', toStopId: 'merkato',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },

  // ── Mexico from Arat (Bus) ──
  { fromStopId: 'arat_kilo', toStopId: 'mexico',    transportType: 'bus',  estimatedFare: 7,  estimatedTime: 15 },
  { fromStopId: 'arat_kilo', toStopId: '22_mazoria', transportType: 'bus', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'arat_kilo', toStopId: 'megenagna',  transportType: 'bus', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'arat_kilo', toStopId: 'bole',       transportType: 'bus', estimatedFare: 10, estimatedTime: 18 },

  // ── 4 Kilo Hub Routes ──
  { fromStopId: '4kilo', toStopId: '6kilo',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 5 },
  { fromStopId: '4kilo', toStopId: 'shiromeda',   transportType: 'taxi', estimatedFare: 10, estimatedTime: 10 },
  { fromStopId: '4kilo', toStopId: 'ferensay',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: '4kilo', toStopId: 'stadium',     transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: '4kilo', toStopId: 'piassa',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },

  // ── 6 Kilo / 5 Kilo (Passing-by) ──
  { fromStopId: '6kilo', toStopId: 'mexico',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 12, isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'stadium',     transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'shiromeda',   transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: '6kilo', toStopId: 'ferensay',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'mexico',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 12, isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'stadium',     transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'shiromeda',   transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: '5kilo', toStopId: 'ferensay',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },

  // ── Piassa Hub Routes ──
  { fromStopId: 'piassa', toStopId: 'kera',        transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'piassa', toStopId: 'bole',        transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'piassa', toStopId: 'megenagna',   transportType: 'taxi', estimatedFare: 12, estimatedTime: 20 },
  { fromStopId: 'piassa', toStopId: 'saris',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'atikilt_tera', toStopId: 'piassa', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 5 },
  { fromStopId: 'gebya',        toStopId: 'piassa', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 5 },
  { fromStopId: 'paulos',       toStopId: 'piassa', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'asko',         toStopId: 'piassa', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'mesfin',       toStopId: 'piassa', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 5 },

  // ── Jemmo Hub Routes ──
  { fromStopId: 'garment',   toStopId: 'jemmo',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'sefere',    toStopId: 'jemmo',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'aser_tena',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'saris',        transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'jemmo', toStopId: 'tulu_dimtu',   transportType: 'taxi', estimatedFare: 15, estimatedTime: 25 },
  { fromStopId: 'jemmo', toStopId: 'mexico',       transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'jemmo', toStopId: 'autobis_tera', transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'jemmo', toStopId: 'piassa',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'jemmo', toStopId: 'merkato',      transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'jemmo', toStopId: 'gofa',         transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'jemmo', toStopId: 'kera',         transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },

  // ── Jemmo → Lideta (Passing-by) ──
  { fromStopId: 'jemmo',  toStopId: 'lideta',       transportType: 'taxi', estimatedFare: 10, estimatedTime: 12, isPassingBy: true },
  { fromStopId: 'lideta', toStopId: 'autobis_tera', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'lideta', toStopId: 'piassa',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'lideta', toStopId: 'merkato',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'lideta', toStopId: 'torhayloch',   transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'lideta', toStopId: 'aser_tena',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'lideta', toStopId: 'bethel',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },

  // ── Megenagna Hub Routes ──
  { fromStopId: 'megenagna', toStopId: 'bole',        transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'megenagna', toStopId: 'kasanchis',   transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'megenagna', toStopId: 'stadium',     transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'megenagna', toStopId: 'ayat',        transportType: 'taxi', estimatedFare: 12, estimatedTime: 20 },
  { fromStopId: 'megenagna', toStopId: 'semit',       transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'megenagna', toStopId: 'saris_abo',   transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'hana_mariam', transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'garment',     transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'tulu_dimtu',  transportType: 'taxi', estimatedFare: 15, estimatedTime: 30 },
  { fromStopId: 'megenagna', toStopId: 'kaliti',      transportType: 'taxi', estimatedFare: 15, estimatedTime: 25 },
  { fromStopId: 'megenagna', toStopId: 'mexico',      transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'megenagna', toStopId: 'kotebe',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'kasanchis',  toStopId: 'megenagna',  transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'kasanchis',  toStopId: 'mexico',     transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },

  // ── Bole Hub Routes ──
  { fromStopId: 'bole', toStopId: 'megenagna',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'bole', toStopId: 'ayat',         transportType: 'taxi', estimatedFare: 15, estimatedTime: 25 },
  { fromStopId: 'bole', toStopId: 'semit',        transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'bole', toStopId: 'mexico',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'bole', toStopId: 'merkato',      transportType: 'taxi', estimatedFare: 15, estimatedTime: 20 },
  { fromStopId: 'bole', toStopId: 'autobis_tera', transportType: 'taxi', estimatedFare: 15, estimatedTime: 20 },
  { fromStopId: 'bole', toStopId: 'kaliti',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'bole', toStopId: 'saris_abo',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'bole', toStopId: 'bulbula',      transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },

  // ── Torhayloch Hub Routes ──
  { fromStopId: 'torhayloch', toStopId: 'mexico',     transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'torhayloch', toStopId: 'lideta',     transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'torhayloch', toStopId: 'arat_kilo',  transportType: 'taxi', estimatedFare: 15, estimatedTime: 20 },
  { fromStopId: 'torhayloch', toStopId: 'merkato',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'torhayloch', toStopId: 'ayat',       transportType: 'taxi', estimatedFare: 25, estimatedTime: 45 },
  { fromStopId: 'aser_tena',   toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'kera',        toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'bethel',      toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'alembank',    toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'korfe',       toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'zenebe_work', toStopId: 'torhayloch', transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'torhayloch',  toStopId: 'marco',     transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'torhayloch',  toStopId: 'stadium',   transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'torhayloch',  toStopId: 'au',        transportType: 'taxi', estimatedFare: 12, estimatedTime: 15 },
  { fromStopId: 'torhayloch',  toStopId: 'megenagna', transportType: 'taxi', estimatedFare: 20, estimatedTime: 30 },

  // ── Bisrate Gabriel (Passing-by) ──
  { fromStopId: 'bisrate_gabriel', toStopId: 'mexico',     transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'jemmo',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8,  isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'aser_tena',  transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'piassa',     transportType: 'taxi', estimatedFare: 10, estimatedTime: 15, isPassingBy: true },
  { fromStopId: 'bisrate_gabriel', toStopId: 'merkato',    transportType: 'taxi', estimatedFare: 10, estimatedTime: 15, isPassingBy: true },

  // ── Sebeta / NOC / Furi ──
  { fromStopId: 'sebeta', toStopId: 'temmo',       transportType: 'taxi', estimatedFare: 15, estimatedTime: 25 },
  { fromStopId: 'noc',    toStopId: 'temmo',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 20 },
  { fromStopId: 'furi',   toStopId: 'temmo',       transportType: 'taxi', estimatedFare: 12, estimatedTime: 20 },
  { fromStopId: 'sebeta', toStopId: 'aser_tena',   transportType: 'taxi', estimatedFare: 20, estimatedTime: 30 },
  { fromStopId: 'furi',   toStopId: 'aser_tena',   transportType: 'taxi', estimatedFare: 15, estimatedTime: 25 },

  // ── Beka Abdo / Arabsa Area ──
  { fromStopId: 'beka_abdo', toStopId: 'ayat',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 15 },
  { fromStopId: 'arabsa',    toStopId: 'ayat',      transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'beka_abdo', toStopId: 'cmc',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'beka_abdo', toStopId: 'kotebe',    transportType: 'taxi', estimatedFare: 7,  estimatedTime: 10 },
  { fromStopId: 'beka_abdo', toStopId: 'gurd_shola', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'arabsa',    toStopId: 'cmc',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },

  // ── Merkato connections ──
  { fromStopId: 'merkato', toStopId: 'piassa',       transportType: 'taxi', estimatedFare: 7,  estimatedTime: 8 },
  { fromStopId: 'merkato', toStopId: 'autobis_tera', transportType: 'taxi', estimatedFare: 7,  estimatedTime: 5 },
  { fromStopId: 'merkato', toStopId: 'mexico',       transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },

  // ── Additional cross-connections ──
  { fromStopId: 'saris', toStopId: 'megenagna',   transportType: 'taxi', estimatedFare: 12, estimatedTime: 18 },
  { fromStopId: 'gofa',  toStopId: 'mexico',      transportType: 'taxi', estimatedFare: 10, estimatedTime: 12 },
  { fromStopId: 'gofa',  toStopId: 'megenagna',   transportType: 'taxi', estimatedFare: 15, estimatedTime: 22 },
  { fromStopId: '22_mazoria', toStopId: 'megenagna', transportType: 'taxi', estimatedFare: 7, estimatedTime: 10 },
  { fromStopId: '22_mazoria', toStopId: 'mexico',    transportType: 'taxi', estimatedFare: 7, estimatedTime: 8 },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

/** Get a stop by its ID */
export function getStopById(id: string): Stop | undefined {
  return STOPS.find(s => s.id === id);
}

/** Get all stops sorted alphabetically */
export function getAllStopsSorted(): Stop[] {
  return [...STOPS].sort((a, b) => a.name.localeCompare(b.name));
}

/** Get all connections from a specific stop */
export function getConnectionsFrom(stopId: string): RouteConnection[] {
  return CONNECTIONS.filter(c => c.fromStopId === stopId);
}

/** Get all connections to a specific stop */
export function getConnectionsTo(stopId: string): RouteConnection[] {
  return CONNECTIONS.filter(c => c.toStopId === stopId);
}

/** Get unique hub stop IDs (stops that have outgoing connections) */
export function getHubStopIds(): string[] {
  const hubs = new Set<string>();
  for (const c of CONNECTIONS) {
    hubs.add(c.fromStopId);
  }
  return Array.from(hubs);
}
