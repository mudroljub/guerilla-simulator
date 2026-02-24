export interface Position {
  x: number;
  y: number;
}

export interface SettlementData {
  position: Position;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

export interface RegionData extends SettlementData {
  name: string;
  polygon: [number, number][];
}

export enum Status {
  Occupied = 'occupied',
  Attacked = 'attacked',
  Liberated = 'liberated',
}

export interface RegionState {
  status: Status;
  garrison: number;
  fraction: "German" | "Italian" | "Partisan";
}

export type RegionsState = Record<string, RegionState>

export interface MapState {
  regionDict: RegionsState;
  selected: RegionData | null;
}
