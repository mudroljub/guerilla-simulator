import { RegionDict, Garrison } from "../types/types";

export type RegionAction =
  | { type: "ATTACK"; region: string; assaultTroops: Garrison }

export function regionsReducer(state: RegionDict, action: RegionAction): RegionDict {
  switch (action.type) {
    // TODO: prebaciti trupe sa napadajuće na napadnutu oblast
    case "ATTACK": {
      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          assaultTroops: action.assaultTroops,
        },
      };
    }

    default:
      return state;
  }
}