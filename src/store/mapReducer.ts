import { regionsReducer, RegionAction } from "./regionsReducer";
import { SelectionAction, selectionReducer } from "./selectionReducer";
import { RegionData } from "../types/types";

export interface MapState {
  regions: Record<string, RegionData>;
  selected: string | null;
}

export type MapAction = RegionAction | SelectionAction;

export function mapReducer(state: MapState, action: MapAction): MapState {
  return {
    regions: regionsReducer(state.regions, action as any),
    selected: selectionReducer(state.selected, action as any),
  };
}