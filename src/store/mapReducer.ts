import { GamePhase, RegionState, Troops, UnitType } from '../types/types'
import { MapState } from './store'

export type MapAction =
  | {
      type: 'COMBAT_MOVE'; attackedRegion: string; attackingRegion: string; attackingForces: Troops;
    }
  | { type: 'SELECT_REGION'; region: RegionState }
  | { type: 'DESELECT'; region?: RegionState }
  | { type: 'CONDUCT_COMBAT' }
  | { type: 'SET_PHASE'; phase: GamePhase }

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SELECT_REGION':
      return { ...state, selected: action.region }

    case 'DESELECT':
      return { ...state, selected: null }

    case 'COMBAT_MOVE': {
      const attacker = state.regionDict[action.attackingRegion]
      const defender = state.regionDict[action.attackedRegion]

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
      }

      const selected = state.selected
        ? regionDict[state.selected.name]
        : null

      return {
        ...state,
        regionDict,
        selected,
      }
    }

    case 'CONDUCT_COMBAT': {
      const battleQueue = Object.values(state.regionDict)
        .filter(region => region.attackingForces)
        .map(region => region.name)

      return {
        ...state,
        battleQueue,
        phase: GamePhase.CONDUCT_COMBAT
      }
    }

    case 'SET_PHASE': {
      return {
        ...state,
        phase: action.phase
      }
    }

    default:
      return state
  }
}