export interface Position {
  x: number;
  y: number;
}

/** REGION DATA */

export interface SettlementData {
  population: number;
  size: number;       // population normalized
  position: Position; // lat-lon normalized
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

export type Troops = { infantry: number } & Partial<Record<Exclude<UnitType, "infantry">, number>>;

export enum Fraction {
  German = 'German',
  Partisan = 'Partisan',
}

/** REGION STATE */

export interface RegionState extends RegionData {
  fraction: Fraction;
  garrison: Troops;
  attackingForces?: Troops;
}

/** GAME PHASES */

export enum GamePhase {
  COMBAT_MOVE = "COMBAT_MOVE",
  CONDUCT_COMBAT = "CONDUCT_COMBAT",
  NON_COMBAT_MOVE = "NON_COMBAT_MOVE",
  MOBILIZE_NEW_UNITS = "MOBILIZE_NEW_UNITS"
}