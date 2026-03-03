export interface Position {
  x: number;
  y: number;
}

/** REGION DATA */

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

/** UNITS & FRACTIONS */

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

/** REGION STATE */

export interface RegionState extends RegionData {
  fraction: Fraction;
  garrison: Garrison;
  attackingForces?: Garrison;
}

export interface RegionStateDerived {
  partisanNeighbors: string[];
  attackable: boolean;
  attacked: boolean;
}

/** STORE */

export type RegionDict = Record<string, RegionState>

export interface MapState {
  regionDict: RegionDict;
  selected: RegionState | null;
}
