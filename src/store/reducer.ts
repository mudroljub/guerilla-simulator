import { CITIES_FOR_OFFENSIVE, CITY_THRESHOLD } from '../config'
import { BombingMission, BombingTarget, Fraction, GamePhase, RegionState, Troops, UnitType } from '../types/types'
import { MapState } from './store'
import { getBombingResult } from './utils'

export type Action =
  | { type: 'ATTACK_REGION'; attackedRegion: string; attackingRegion: string; attackingForces: Troops }
  | { type: 'SELECT_REGION'; region: RegionState }
  | { type: 'DESELECT_REGION'; region?: RegionState }
  | { type: 'END_BATTLE'; regionName: string; winner: Fraction; survivors: Troops }
  | { type: 'SELECT_ATTACKING_REGION', regionName: string }
  | { type: 'RETREAT', regionName: string, garrison: Troops, retreatingRegion: string, retreatingTroops: Troops }
  | { type: 'START_MOBILIZATION' }
  | { type: 'DO_BOMBING' }
  | { type: 'APPLY_BOMBING_RESULTS', eventIndex: number }
  | { type: 'START_OFFENSIVE' }
  | { type: 'NEXT_PHASE' }

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

        return reducer(state, { type: 'START_MOBILIZATION' })
      }

      if (state.phase === GamePhase.MOBILIZATION_PHASE) {
        const liberatedCities = Object.values(state.regionDict)
          .filter(region => region.fraction === Fraction.Partisan && region.size > CITY_THRESHOLD)

        if (liberatedCities.length >= CITIES_FOR_OFFENSIVE)
          return reducer(state, { type: 'START_OFFENSIVE' })

        return reducer(state, { type: 'DO_BOMBING' })
      }

      if (state.phase === GamePhase.BOMBING_PHASE) {
        const currentIndex = state.bombingIndex ?? 0
        const { bombings } = state
        const nextIndex = currentIndex + 1

        if (nextIndex <= bombings.length)
          return {
            ...state,
            bombingIndex: nextIndex
          }

        return {
          ...state,
          phase: GamePhase.ATTACK_PHASE,
          bombings: [],
          bombingIndex: 0,
          selected: null
        }
      }

      return state
    }

    case 'DO_BOMBING': {
      const bombings: BombingMission[] = Object.values(state.regionDict)
        .filter(region => region.fraction === Fraction.German && (region.garrison.aircraft ?? 0) > 0 && region.size > CITY_THRESHOLD)
        .map(region => ({
          bombingFrom: region.name,
          targets: region.neighbors
            .filter(n => state.regionDict[n].fraction === Fraction.Partisan)
            .map((n): BombingTarget => getBombingResult(n, state.regionDict[n]))
        }))
        .filter(b => b.targets.length > 0)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)

      if (bombings.length === 0)
        return {
          ...state,
          bombings: [],
          bombingIndex: 0,
          phase: GamePhase.ATTACK_PHASE,
        }

      return {
        ...state,
        bombings,
        bombingIndex: 0,
        phase: GamePhase.BOMBING_PHASE,
      }
    }

    case 'APPLY_BOMBING_RESULTS': {
      const bombing = state.bombings?.[action.eventIndex]
      if (!bombing) return state

      const newRegionDict = { ...state.regionDict }

      bombing.targets.forEach(t => {
        const region = newRegionDict[t.regionName]
        if (t.isShotDown) {
          const source = newRegionDict[bombing.bombingFrom]
          newRegionDict[bombing.bombingFrom] = {
            ...source,
            garrison: {
              ...source.garrison,
              aircraft: Math.max(0, (source.garrison.aircraft ?? 0) - 1)
            }
          }
        } else
          newRegionDict[t.regionName] = {
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

      const newState = {
        ...state,
        regionDict,
        battleQueue,
        selected: null,
      }

      if (battleQueue.length === 0)
        return reducer(newState, { type: 'START_MOBILIZATION' })

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
        return reducer(newState, { type: 'START_MOBILIZATION' })

      return newState
    }

    case 'START_MOBILIZATION': {
      const MOB_RATE = 0.005
      const MAX_LIMIT_PERCENT = 0.15

      const updatedRegions = Object.keys(state.regionDict).reduce((acc, regionName) => {
        const region = state.regionDict[regionName]

        if (region.fraction !== Fraction.Partisan) {
          acc[regionName] = { ...region, lastMobilizedCount: 0 }
          return acc
        }

        const limit = Math.floor(region.initialPopulation * MAX_LIMIT_PERCENT)
        const potential = Math.floor(region.population * MOB_RATE)
        const remainingToMobilize = limit - region.totalMobilized
        const actualAdded = Math.max(0, Math.min(potential, remainingToMobilize))

        acc[regionName] = {
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

    case 'START_OFFENSIVE': {
      const newRegionDict = { ...state.regionDict }

      const liberatedCities = Object.values(state.regionDict).filter(
        r => r.fraction === Fraction.Partisan && r.size > CITY_THRESHOLD
      )

      liberatedCities.forEach(city => {
        const germanNeighbors = city.neighbors
          .map(name => newRegionDict[name])
          .filter(n => n.fraction === Fraction.German)

        if (germanNeighbors.length === 0) return

        const strongestNeighbor = germanNeighbors.reduce((prev, current) => {
          const prevSum = Object.values(prev.garrison).reduce((a, b) => a + b, 0)
          const currSum = Object.values(current.garrison).reduce((a, b) => a + b, 0)
          return currSum > prevSum ? current : prev
        })

        const cityGarrisonSize = Object.values(city.garrison).reduce((a, b) => a + b, 0)
        const offensiveSize = cityGarrisonSize * 6

        const offensiveTroops: Troops = {
          infantry: Math.floor(offensiveSize * 0.90),
          [UnitType.artillery]: Math.floor(offensiveSize * 0.06),
          [UnitType.tanks]: Math.floor(offensiveSize * 0.03),
          [UnitType.aircraft]: strongestNeighbor.garrison.aircraft || 0
        }
        newRegionDict[strongestNeighbor.name] = {
          ...strongestNeighbor,
          garrison: offensiveTroops,
        }
      })

      return {
        ...state,
        regionDict: newRegionDict,
        phase: GamePhase.ENEMY_OFFENSIVE,
        currentOffensive: state.currentOffensive + 1,
      }
    }

    default:
      return state
  }
}