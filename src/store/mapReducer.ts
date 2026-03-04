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

      const newRegionDict = {
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

      // osveži selected ako je pogođen
      let newSelected = state.selected;
      if (state.selected) {
        const name = state.selected.name;
        if (name === action.attackedRegion || name === action.attackingRegion) {
          newSelected = newRegionDict[name];
        }
      }

      return {
        ...state,
        regionDict: newRegionDict,
        selected: newSelected,
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