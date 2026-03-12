export interface Position {
  x: number;
  y: number;
}

/** REGION DATA */

export interface SettlementData {
  population: number;
  size: number;       // population normalized
  position: Position; // geo normalized * MAP_SIZE
}

export type Settlements = Record<string, SettlementData>;

export interface RegionData extends SettlementData {
  name: string;
  polygon: [number, number][];
  area: number;
  neighbors: string[];
  initialPopulation: number;
}

/** UNITS & FRACTIONS */

export enum UnitType {
  infantry = 'infantry',
  artillery = 'artillery',
  tanks = 'tanks',
  aircraft = 'aircraft',
}

export type Troops = { infantry: number } & Partial<Record<Exclude<UnitType, 'infantry'>, number>>;

export enum Fraction {
  German = 'German',
  Partisan = 'Partisan',
}

/** REGION STATE */

export interface RegionState extends RegionData {
  fraction: Fraction;
  garrison: Troops;
  totalMobilized: number;
  lastMobilizedCount: number;
  attackingForces?: Troops;
}

/** GAME PHASES */

export enum GamePhase {
  ATTACK_PHASE = 'ATTACK_PHASE',
  COMBAT_PHASE = 'COMBAT_PHASE',
  MOBILIZATION_PHASE = 'MOBILIZATION_PHASE',
  BOMBARDMENT = 'BOMBARDMENT',
}

export type BombingTarget = {
  regionName: string
  isShotDown: boolean
  damage: number
}

export type BombingMission = {
  bombingFrom: string
  targets: BombingTarget[]
}

/** COMPONENTS */

export type IconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

export type IconDict = Record<Fraction, Partial<Record<UnitType, IconComponent[]>>>