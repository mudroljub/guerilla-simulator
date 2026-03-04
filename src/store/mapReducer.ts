import { MapState, RegionState, Troops, UnitType } from "../types/types";

export type MapAction =
  | {
      type: "ATTACK";
      attackedRegion: string;
      attackingRegion: string;
      attackingForces: Troops;
    }
  | { type: "SELECT_REGION"; region: RegionState }
  | { type: "DESELECT"; region?: RegionState };

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case "ATTACK": {
      const attacker = state.regionDict[action.attackingRegion];
      const defender = state.regionDict[action.attackedRegion];

      const updatedGarrison: Troops = {} as Troops;
      for (const unit of Object.values(UnitType)) {
        const current = attacker.garrison[unit] ?? 0;
        const sent = action.attackingForces[unit] ?? 0;
        updatedGarrison[unit] = Math.max(0, current - sent);
      }

      const regionDict = {
        ...state.regionDict,
        [action.attackedRegion]: {
          ...defender,
          attackingForces: action.attackingForces,
        },
        [action.attackingRegion]: {
          ...attacker,
          garrison: updatedGarrison,
        },
      };

      // refresh selected reference (for modal)
      const selected = state.selected 
          ? regionDict[state.selected.name] 
          : null

      return {
        ...state,
        regionDict,
        selected,
      };
    }

    case "SELECT_REGION":
      return { ...state, selected: action.region };

    case "DESELECT":
      return { ...state, selected: null };

    default:
      return state;
  }
}