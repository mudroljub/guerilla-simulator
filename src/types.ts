export interface Position {
  x: number;
  y: number;
}

export interface Settlement {
  position: Position;
  size: number;
}

export type Settlements = Record<string, Settlement>;
