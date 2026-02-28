import { RegionDict, Status, Garrison } from "../types/types";

export type RegionAction =
  | { type: "ATTACK_REGION"; region: string; damage?: Partial<Garrison> }

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
            infantry: Math.max(0, (current.infantry ?? 0) - (damage.infantry ?? 0)),
            artillery: Math.max(0, (current.artillery ?? 0) - (damage.artillery ?? 0)),
            tanks: Math.max(0, (current.tanks ?? 0) - (damage.tanks ?? 0)),
            aircraft: Math.max(0, (current.aircraft ?? 0) - (damage.aircraft ?? 0)),
          },
        },
      };
    }


    default:
      return state;
  }
}