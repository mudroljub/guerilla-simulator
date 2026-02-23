import { State } from "../types/types";

export type RegionStateMap = Record<string, State>;

export type RegionAction = { type: "TOGGLE_REGION"; name: string };

export function regionReducer(
  state: RegionStateMap,
  action: RegionAction,
): RegionStateMap {
  switch (action.type) {
    case "TOGGLE_REGION": {
      const cur = state[action.name] ?? State.Occupied;
      const next = cur === State.Occupied ? State.Liberated : State.Occupied;
      return { ...state, [action.name]: next };
    }
    default:
      return state;
  }
}
