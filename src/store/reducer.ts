import { Fraction, GamePhase, RegionState, Troops, UnitType } from '../types/types'
import { MapState } from './store'

export type Action =
  | {
      type: 'ATTACK_REGION'; attackedRegion: string; attackingRegion: string; attackingForces: Troops;
    }
  | { type: 'SELECT_REGION'; region: RegionState }
  | { type: 'DESELECT_REGION'; region?: RegionState }
  | { type: 'START_COMBAT_PHASE' }
  | {
      type: 'END_BATTLE'; regionName: string; winner: Fraction; survivors: Troops;
    }
  | { type: 'END_TURN' }
  | { type: 'SELECT_ATTACKING_REGION', regionName: string }
  | { type: 'RETREAT', regionName: string, garrison: Troops, retreatingRegion: string, retreatingTroops: Troops }

export function reducer(state: MapState, action: Action): MapState {
  switch (action.type) {
    case 'SELECT_REGION':
      return { ...state, selected: action.region }

    case 'DESELECT_REGION':
      return { ...state, selected: null }

    case 'ATTACK_REGION': {
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
    case 'END_TURN': {
      const attackingRegions = Object.values(state.regionDict)
        .filter(region =>
          region.attackingForces && Object.values(region.attackingForces).some(count => count > 0)
        )

      if (attackingRegions.length > 0)
        return {
          ...state,
          battleQueue: attackingRegions.map(r => r.name),
          phase: GamePhase.COMBAT_PHASE,
          selected: null
        }

      return {
        ...state,
        phase: GamePhase.MOBILIZATION,
        selected: null
      }
    }

    case 'START_COMBAT_PHASE': {
      const battleQueue = Object.values(state.regionDict)
        .filter(region => region.attackingForces)
        .map(region => region.name)

      return {
        ...state,
        battleQueue,
        phase: GamePhase.COMBAT_PHASE
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

    case 'SELECT_ATTACKING_REGION':
      return {
        ...state,
        selectedAttackingRegion: action.regionName
      }

    case 'RETREAT': {
      const { regionName, garrison, retreatingRegion, retreatingTroops } = action

      const battleRegion = state.regionDict[regionName]
      const fallbackRegion = state.regionDict[retreatingRegion]

      const updatedFallbackGarrison = Object.values(UnitType).reduce((acc, unit) => ({
        ...acc,
        [unit]: (fallbackRegion.garrison[unit] ?? 0) + (retreatingTroops[unit] ?? 0),
      }), {} as Troops)

      const regionDict = {
        ...state.regionDict,
        [regionName]: {
          ...battleRegion,
          garrison,
          attackingForces: undefined,
        },
        [retreatingRegion]: {
          ...fallbackRegion,
          garrison: updatedFallbackGarrison,
        },
      }

      const battleQueue = state.battleQueue.filter(name => name !== regionName)
      const isQueueEmpty = battleQueue.length === 0

      return {
        ...state,
        regionDict,
        battleQueue,
        phase: isQueueEmpty ? GamePhase.MOBILIZATION : state.phase,
        selected: regionDict[retreatingRegion],
        selectedAttackingRegion: undefined,
      }
    }

    default:
      return state
  }
}