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
}

/** STATES */

export enum Status {
  Occupied = 'occupied',
  Attacked = 'attacked',
  Liberated = 'liberated',
}

export type UnitType =
  | "infantry"
  | "artillery"
  | "tanks"
  | "aircraft";

export type Garrison = Record<UnitType, number>;

export type Fraction = "German" | "Italian" | "Partisan"

export interface RegionState {
  status: Status;
  garrison: Garrison;
  fraction: Fraction;
}

export type RegionDict = Record<string, RegionState>

export interface MapState {
  regionDict: RegionDict;
  selected: RegionData | null;
}
