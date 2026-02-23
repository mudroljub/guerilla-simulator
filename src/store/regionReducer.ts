import { RegionState } from "../types/types";

export type MapState = Record<string, RegionState>;

export type RegionAction = { type: "TOGGLE_REGION"; name: string };

export function regionReducer(
  state: MapState,
  action: RegionAction,
): MapState {
  switch (action.type) {
    case "TOGGLE_REGION": {
      const cur = state[action.name] ?? RegionState.Occupied;
      const next = cur === RegionState.Occupied ? RegionState.Liberated : RegionState.Occupied;
      return { ...state, [action.name]: next };
    }
    default:
      return state;
  }
}
