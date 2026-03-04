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

      const garrison = Object.values(UnitType).reduce((acc, unit) => ({
        ...acc,
        [unit]: Math.max(0, (attacker.garrison[unit] ?? 0) - (action.attackingForces[unit] ?? 0))
      }), {} as Troops)

      const attackingForces = Object.values(UnitType).reduce((acc, unit) => ({
        ...acc,
        [unit]: (defender.attackingForces?.[unit] ?? 0) + (action.attackingForces[unit] ?? 0)
      }), {} as Troops)

      const regionDict = {
        ...state.regionDict,
        [action.attackedRegion]: {
          ...defender,
          attackingForces,
        },
        [action.attackingRegion]: {
          ...attacker,
          garrison,
        },
      };

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