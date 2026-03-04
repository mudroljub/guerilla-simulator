import { RegionDict, Troops, UnitType } from "../types/types";

export type RegionAction =
  | {
      type: "ATTACK";
      attackedRegion: string;
      attackingRegion: string;
      attackingForces: Troops;
    };

export function regionsReducer(
  state: RegionDict,
  action: RegionAction
): RegionDict {
  switch (action.type) {
    case "ATTACK": {
      const attacker = state[action.attackingRegion];
      const defender = state[action.attackedRegion];

      const updatedGarrison: Troops = {} as Troops;
      for (const unit of Object.values(UnitType)) {
        const current = state[action.attackingRegion].garrison[unit] ?? 0;
        const sent = action.attackingForces[unit] ?? 0;
        updatedGarrison[unit] = Math.max(0, current - sent);
      }

      return {
        ...state,
        [action.attackedRegion]: {
          ...defender,
          attackingForces: action.attackingForces,
        },
        [action.attackingRegion]: {
          ...attacker,
          garrison: updatedGarrison,
        },
      };
    }

    default:
      return state;
  }
}