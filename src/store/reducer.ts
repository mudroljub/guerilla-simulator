import { BombardmentEvent, BombardmentTarget, Fraction, GamePhase, RegionState, Troops, UnitType } from '../types/types'
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
  | { type: 'APPLY_BOMBARDMENT_RESULTS', eventIndex: number }

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

      if (state.phase === GamePhase.BOMBARDMENT) {
        const currentIndex = state.currentBombardmentIndex ?? 0
        const nextIndex = currentIndex + 1
        const events = state.bombardmentEvents ?? []

        if (nextIndex < events.length)
          return {
            ...state,
            currentBombardmentIndex: nextIndex
          }

        return {
          ...state,
          phase: GamePhase.ATTACK_PHASE,
          bombardmentEvents: [],
          currentBombardmentIndex: 0,
          selected: null
        }
      }
      return state
    }

    case 'PREPARE_BOMBARDMENT': {
      const events: BombardmentEvent[] = []
      const CITY_LABEL_THRESHOLD = 2

      Object.values(state.regionDict).forEach(source => {
        const aircraftCount = source.garrison.aircraft ?? 0
        const isMajorCity = source.size <= CITY_LABEL_THRESHOLD

        if (source.fraction === Fraction.German && aircraftCount > 0 && isMajorCity) {
          const targets: BombardmentTarget[] = source.neighbors
            .filter(id => state.regionDict[id].fraction === Fraction.Partisan)
            .map(id => {
              const targetRegion = state.regionDict[id]

              const roll = Math.floor(Math.random() * 6) + 1
              const rawChance = (targetRegion.garrison.infantry / 50) * 0.05
              const neededRoll = Math.max(2, 7 - Math.floor(rawChance * 6))

              const isShotDown = roll >= neededRoll
              const damage = isShotDown ? 0 : Math.floor(targetRegion.garrison.infantry * (0.05 + Math.random() * 0.05))

              return { regionId: id, isShotDown, damage }
            })

          if (targets.length > 0)
            events.push({ sourceId: source.name, targets: targets.slice(0, 2) })

        }
      })

      const limitedEvents = events
        .sort((a, b) => {
          const planesA = state.regionDict[a.sourceId].garrison.aircraft ?? 0
          const planesB = state.regionDict[b.sourceId].garrison.aircraft ?? 0
          return planesB - planesA
        })
        .slice(0, 5)

      if (limitedEvents.length === 0)
        return {
          ...state,
          phase: GamePhase.ATTACK_PHASE,
          bombardmentEvents: [],
          currentBombardmentIndex: 0
        }

      return {
        ...state,
        bombardmentEvents: limitedEvents,
        currentBombardmentIndex: 0,
        phase: GamePhase.BOMBARDMENT
      }
    }

    case 'APPLY_BOMBARDMENT_RESULTS': {
      const event = state.bombardmentEvents?.[action.eventIndex]
      if (!event) return state

      const newRegionDict = { ...state.regionDict }

      event.targets.forEach(t => {
        const region = newRegionDict[t.regionId]
        if (t.isShotDown) {
          const source = newRegionDict[event.sourceId]
          newRegionDict[event.sourceId] = {
            ...source,
            garrison: {
              ...source.garrison,
              aircraft: Math.max(0, (source.garrison.aircraft ?? 0) - 1)
            }
          }
        } else
          newRegionDict[t.regionId] = {
            ...region,
            garrison: {
              ...region.garrison,
              infantry: Math.max(0, region.garrison.infantry - t.damage)
            }
          }

      })

      return { ...state, regionDict: newRegionDict }
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

    default:
      return state
  }
}