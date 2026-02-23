import { State } from "../fsm/states";

export interface Position {
  x: number;
  y: number;
}

export interface SettlementData {
  position: Position;
  size: number;
}

export type Settlements = Record<string, SettlementData>;

export interface IRegion extends SettlementData {
  name: string;
  polygon: [number, number][];
  state: State;
}