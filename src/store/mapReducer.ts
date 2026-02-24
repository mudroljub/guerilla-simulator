import { regionsReducer, RegionAction } from "./regionsReducer";
import { SelectionAction, selectionReducer } from "./selectionReducer";
import { MapState } from "../types/types";


export type MapAction = RegionAction | SelectionAction;

export function mapReducer(state: MapState, action: MapAction): MapState {
  return {
    regionDict: regionsReducer(state.regionDict, action as any),
    selected: selectionReducer(state.selected, action as any),
  };
}