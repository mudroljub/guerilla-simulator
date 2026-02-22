export interface Position {
  x: number;
  y: number;
}

export interface SettlementData {
  position: Position;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

export interface IRegion {
  name: string;
  position: [number, number];
  size: number;
  polygon: [number, number][];
}
