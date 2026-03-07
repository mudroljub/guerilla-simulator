import { Fraction, GamePhase, RegionState, Troops, UnitType } from '../types/types'
import { MapState } from './store'

export type MapAction =
  | {
      type: 'COMBAT_MOVE'; attackedRegion: string; attackingRegion: string; attackingForces: Troops;
    }
  | { type: 'SELECT_REGION'; region: RegionState }
  | { type: 'DESELECT'; region?: RegionState }
  | { type: 'CONDUCT_COMBAT' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | {
        type: 'END_BATTLE';
        regionName: string;
        winner: Fraction;
        survivors: Troops;
      }

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

    case 'END_BATTLE': {
      const { regionName, winner, survivors } = action
      const currentRegion = state.regionDict[regionName]

      const updatedRegion: RegionState = {
        ...currentRegion,
        fraction: winner,
        garrison: survivors,
        attackingForces: undefined,
      }

      const regionDict = {
        ...state.regionDict,
        [regionName]: updatedRegion,
      }

      const battleQueue = state.battleQueue.filter(name => name !== regionName)
      const isQueueEmpty = battleQueue.length === 0
      const phase = isQueueEmpty ? GamePhase.MOBILIZATION : state.phase

      return {
        ...state,
        regionDict,
        battleQueue,
        phase,
        selected: null,
      }
    }

    default:
      return state
  }
}