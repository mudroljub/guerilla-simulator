import { Status } from "../types/types";

export interface MapState {
  regions: Record<string, Status>;
  selected: string | null;
}

export type MapAction =
  | { type: "SET_REGION_STATE"; region: string; state: Status }
  | { type: "SELECT_REGION"; region: string }
  | { type: "CLEAR_SELECTION" };

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {

    case "SET_REGION_STATE":
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.region]: action.state,
        },
      };

    case "SELECT_REGION":
      return {
        ...state,
        selected: action.region,
      };

    case "CLEAR_SELECTION":
      return {
        ...state,
        selected: null,
      };

    default:
      return state;
  }
}