export interface Position {
  x: number;
  y: number;
}

export interface SettlementData {
  position: Position;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

export enum RegionState {
  Occupied = 'occupied',
  Attacked = 'attacked',
  Liberated = 'liberated',
}

export enum RegionUIState {
  Idle = 'idle',
  Selected = 'selected',
}

export interface IRegion extends SettlementData {
  name: string;
  polygon: [number, number][];
  initialState: RegionState;
  initialUIState: RegionUIState;
}