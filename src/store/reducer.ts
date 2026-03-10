import { BombardmentEvent, Fraction, GamePhase, RegionState, Troops, UnitType } from '../types/types'
import { MapState } from './store'

export type Action =
  | { type: 'ATTACK_REGION'; attackedRegion: string; attackingRegion: string; attackingForces: Troops }
  | { type: 'SELECT_REGION'; region: RegionState }
  | { type: 'DESELECT_REGION'; region?: RegionState }
  | { type: 'END_BATTLE'; regionName: string; winner: Fraction; survivors: Troops }
  | { type: 'NEXT_PHASE' }
  | { type: 'SELECT_ATTACKING_REGION', regionName: string }
  | { type: 'RETREAT', regionName: string, garrison: Troops, retreatingRegion: string, retreatingTroops: Troops }
  | { type: 'MOBILIZE_UNITS' }
  | { type: 'PREPARE_BOMBARDMENT' }
  | { type: 'RESOLVE_BOMBARD_HIT', targetId: string }
  | { type: 'RESOLVE_PLANE_DOWN', sourceId: string }

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
        [action.attackedRegion]: { ...defender, attackingForces },
        [action.attackingRegion]: { ...attacker, garrison }
      }

      return {
        ...state,
        regionDict,
        selected: state.selected ? regionDict[state.selected.name] : null,
        selectedAttackingRegion: undefined
      }
    }

    case 'NEXT_PHASE': {
      if (state.phase === GamePhase.ATTACK_PHASE) {
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

        return reducer(state, { type: 'MOBILIZE_UNITS' })
      }

      if (state.phase === GamePhase.MOBILIZATION_PHASE)
        return reducer(state, { type: 'PREPARE_BOMBARDMENT' })

      if (state.phase === GamePhase.BOMBARDMENT)
        return {
          ...state,
          phase: GamePhase.ATTACK_PHASE,
          bombardmentEvents: [],
          currentBombardmentIndex: 0
        }

      return state
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

      const newState = {
        ...state,
        regionDict,
        battleQueue,
        selected: null,
      }

      if (isQueueEmpty)
        return reducer(newState, { type: 'MOBILIZE_UNITS' })

      return newState
    }

    case 'SELECT_ATTACKING_REGION':
      return {
        ...state,
        selectedAttackingRegion: action.regionName
      }

    case 'RETREAT': {
      const { regionName, garrison, retreatingRegion, retreatingTroops } = action
      const fallbackRegion = state.regionDict[retreatingRegion]

      const updatedFallbackGarrison = Object.values(UnitType).reduce((acc, unit) => ({
        ...acc,
        [unit]: (fallbackRegion.garrison[unit] ?? 0) + (retreatingTroops[unit] ?? 0)
      }), {} as Troops)

      const regionDict = {
        ...state.regionDict,
        [regionName]: {
          ...state.regionDict[regionName],
          garrison,
          attackingForces: undefined
        },
        [retreatingRegion]: {
          ...fallbackRegion,
          garrison: updatedFallbackGarrison
        }
      }

      const battleQueue = state.battleQueue.filter(name => name !== regionName)
      const isQueueEmpty = battleQueue.length === 0

      const newState = {
        ...state,
        regionDict,
        battleQueue,
        selected: regionDict[retreatingRegion],
        selectedAttackingRegion: undefined
      }

      if (isQueueEmpty)
        return reducer(newState, { type: 'MOBILIZE_UNITS' })

      return newState
    }

    case 'MOBILIZE_UNITS': {
      const MOB_RATE = 0.005
      const MAX_LIMIT_PERCENT = 0.15

      const updatedRegions = Object.keys(state.regionDict).reduce((acc, regionId) => {
        const region = state.regionDict[regionId]

        if (region.fraction !== Fraction.Partisan) {
          acc[regionId] = { ...region, lastMobilizedCount: 0 }
          return acc
        }

        const limit = Math.floor(region.initialPopulation * MAX_LIMIT_PERCENT)
        const potential = Math.floor(region.population * MOB_RATE)
        const remainingToMobilize = limit - region.totalMobilized
        const actualAdded = Math.max(0, Math.min(potential, remainingToMobilize))

        acc[regionId] = {
          ...region,
          population: region.population - actualAdded,
          totalMobilized: region.totalMobilized + actualAdded,
          lastMobilizedCount: actualAdded,
          garrison: {
            ...region.garrison,
            infantry: region.garrison.infantry + actualAdded,
          },
        }

        return acc
      }, {} as Record<string, RegionState>)

      return {
        ...state,
        regionDict: updatedRegions,
        phase: GamePhase.MOBILIZATION_PHASE,
        selected: null
      }
    }

    case 'PREPARE_BOMBARDMENT': {
      const events: BombardmentEvent[] = []
      const CHANCE_PER_50_SOLDIERS = 0.05

      Object.values(state.regionDict).forEach(source => {
        const aircraftCount = source.garrison.aircraft ?? 0
        if (source.fraction === Fraction.German && aircraftCount > 0) {
          const targets = source.neighbors
            .filter(id => state.regionDict[id].fraction === Fraction.Partisan)
            .map(id => {
              const targetRegion = state.regionDict[id]
              const rawChance = (targetRegion.garrison.infantry / 50) * CHANCE_PER_50_SOLDIERS
              const interceptChance = Math.min(rawChance, 0.8)
              const neededRoll = Math.max(2, 7 - Math.floor(interceptChance * 6))

              return { regionId: id, interceptChance, neededRoll }
            })

          if (targets.length > 0)
            events.push({ sourceId: source.name, targets })
        }
      })

      return {
        ...state,
        bombardmentEvents: events,
        currentBombardmentIndex: 0,
        phase: GamePhase.BOMBARDMENT
      }
    }

    case 'RESOLVE_BOMBARD_HIT': {
      const target = state.regionDict[action.targetId]
      const damagePercent = 0.08 + Math.random() * 0.04
      const losses = Math.floor(target.garrison.infantry * damagePercent)

      return {
        ...state,
        regionDict: {
          ...state.regionDict,
          [action.targetId]: {
            ...target,
            garrison: {
              ...target.garrison,
              infantry: Math.max(0, target.garrison.infantry - losses)
            }
          }
        }
      }
    }

    case 'RESOLVE_PLANE_DOWN': {
      const source = state.regionDict[action.sourceId]
      const currentPlanes = source.garrison.aircraft ?? 0

      return {
        ...state,
        regionDict: {
          ...state.regionDict,
          [action.sourceId]: {
            ...source,
            garrison: {
              ...source.garrison,
              aircraft: Math.max(0, currentPlanes - 1)
            }
          }
        }
      }
    }

    default:
      return state
  }
}