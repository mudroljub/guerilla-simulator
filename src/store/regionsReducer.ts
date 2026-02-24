import { RegionDict, Status, Garrison } from "../types/types";

export type RegionAction =
  | { type: "ATTACK_REGION"; region: string; damage?: Partial<Garrison> }
  | { type: "REINFORCE_REGION"; region: string; troops: Partial<Garrison> };

export function regionsReducer(state: RegionDict, action: RegionAction): RegionDict {
  switch (action.type) {
    case "ATTACK_REGION": {
      const current = state[action.region].garrison;
      const damage: Partial<Garrison> = action.damage || {
        infantry: 1,
        artillery: 0,
        tanks: 0,
        aircraft: 0,
      };

      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          status: Status.Attacked,
          garrison: {
            infantry: Math.max(0, current.infantry - (damage.infantry || 0)),
            artillery: Math.max(0, current.artillery - (damage.artillery || 0)),
            tanks: Math.max(0, current.tanks - (damage.tanks || 0)),
            aircraft: Math.max(0, current.aircraft - (damage.aircraft || 0)),
          },
        },
      };
    }

    case "REINFORCE_REGION": {
      const current = state[action.region].garrison;
      const troops = action.troops;

      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          garrison: {
            infantry: current.infantry + (troops.infantry || 0),
            artillery: current.artillery + (troops.artillery || 0),
            tanks: current.tanks + (troops.tanks || 0),
            aircraft: current.aircraft + (troops.aircraft || 0),
          },
        },
      };
    }

    default:
      return state;
  }
}