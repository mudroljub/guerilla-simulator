import { RegionData, Status } from "../types/types";

export interface MapState {
  regions: Record<string, RegionData>;
  selected: string | null;
}

export type MapAction =
  | { type: "ATTACK_REGION"; region: string }
  | { type: "SELECT_REGION"; region: string }
  | { type: "CLEAR_SELECTION" };

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {

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

    case "ATTACK_REGION":
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.region]: {
            ...state.regions[action.region],
            status: Status.Attacked,
            garrison: state.regions[action.region].garrison - 1
          }
        }
      };

    default:
      return state;
  }
}