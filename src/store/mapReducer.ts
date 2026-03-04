import { RegionState, Troops, UnitType } from "../types/types";
import { MapState } from "./store";

export type MapAction =
  | {
      type: "ATTACK";
      attackedRegion: string;
      attackingRegion: string;
      attackingForces: Troops;
    }
  | { type: "SELECT_REGION"; region: RegionState }
  | { type: "DESELECT"; region?: RegionState }
  | { type: "START_BATTLE_PHASE" }
  | { type: "RESOLVE_BATTLE"; regionName: string }
  | { type: "FINISH_BATTLES" }

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case "SELECT_REGION":
      return { ...state, selected: action.region }

    case "DESELECT":
      return { ...state, selected: null }

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
      }
    }

    case "START_BATTLE_PHASE": {
      const battleQueue = Object.values(state.regionDict)
        .filter(region => region.attackingForces)
        .map(region => region.name)

      return {
        ...state,
        battleQueue,
        isProcessingBattles: true
      }
    }

    case "RESOLVE_BATTLE": {
      const region = state.regionDict[action.regionName];
      if (!region.attackingForces) return state;

      // TODO: implement battle logic, new fraction...
      const newGarrison = { ...region.garrison };

      const regionDict = {
        ...state.regionDict,
        [action.regionName]: {
          ...region,
          garrison: newGarrison,
          attackingForces: undefined // TODO: null
        }
      }

      return {
        ...state,
        regionDict,
        battleQueue: state.battleQueue.slice(1),
        selected: null,
        // TODO: označiti oblast za zumiranje
      }
    }

    case "FINISH_BATTLES":
      return {
        ...state,
        isProcessingBattles: false,
        battleQueue: []
      }

    default:
      return state
  }
}