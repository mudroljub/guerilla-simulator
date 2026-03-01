export interface Position {
  x: number;
  y: number;
}

/** DATA */

export interface SettlementData {
  position: Position;
  population: number;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

export interface RegionData extends SettlementData {
  name: string;
  polygon: [number, number][];
  area: number;
  neighbors: string[];
}

/** STATES */

export enum Status {
  Occupied = 'occupied',
  Liberated = 'liberated',
}

export enum UnitType {
  infantry = 'infantry',
  artillery = 'artillery',
  tanks = 'tanks',
  aircraft = 'aircraft',
}

export type Garrison = { infantry: number } & Partial<Record<Exclude<UnitType, "infantry">, number>>;

export enum Fraction {
  German = 'German',
  Partisan = 'Partisan',
}

export interface RegionState {
  status: Status;
  fraction: Fraction;
  garrison: Garrison;
  assaultTroops?: Garrison;
}

export type RegionDict = Record<string, RegionState>

export interface MapState {
  regionDict: RegionDict;
  selected: RegionData | null;
}
