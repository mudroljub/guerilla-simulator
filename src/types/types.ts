export interface Position {
  x: number;
  y: number;
}

export interface SettlementData {
  position: Position;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

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

export interface IRegion extends SettlementData {
  name: string;
  polygon: [number, number][];
  status: Status;
}