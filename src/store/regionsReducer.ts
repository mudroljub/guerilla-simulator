import { RegionDict, Status } from "../types/types";

export type RegionAction =
  | { type: "ATTACK_REGION"; region: string }
  | { type: "REINFORCE_REGION"; region: string; troops: number };

export function regionsReducer(state: RegionDict, action: RegionAction): RegionDict {
  switch (action.type) {
    case "ATTACK_REGION":
      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          status: Status.Attacked,
          garrison: state[action.region].garrison - 1,
        },
      };

    case "REINFORCE_REGION":
      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          garrison: state[action.region].garrison + action.troops,
        },
      };

    default:
      return state;
  }
}