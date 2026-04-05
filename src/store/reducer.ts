import { CITIES_FOR_OFFENSIVE, CITY_THRESHOLD } from '../config'
import {
  BombingMission,
  BombingTarget,
  Fraction,
  GamePhase,
  RegionState,
  Troops,
  UnitType,
  OffensiveAttack
} from '../types/types'
import { initGarrison } from '../utils/initRegionState'
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
  | { type: 'APPLY_OFFENSIVE_RESULTS', eventIndex: number }
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
        [action.attackedRegion]: {
          ...defender,
          attackingForces,
          attackingFraction: Fraction.Partisan
        },
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
            region.attackingForces && Object.values(region.attackingForces).some(count => (count ?? 0) > 0)
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

      if (state.phase === GamePhase.ENEMY_OFFENSIVE) {
        const currentIndex = state.offensiveAnimationIndex ?? 0
        const nextIndex = currentIndex + 1

        if (nextIndex < state.offensiveAttacks.length)
          return { ...state, offensiveAnimationIndex: nextIndex }

        return {
          ...state,
          phase: GamePhase.COMBAT_PHASE,
          offensiveAnimationIndex: 0,
          selected: null
        }
      }

      if (state.phase === GamePhase.BOMBING_PHASE) {
        const currentIndex = state.bombingIndex ?? 0
        const nextIndex = currentIndex + 1

        if (nextIndex < state.bombings.length)
          return { ...state, bombingIndex: nextIndex }

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

    case 'START_OFFENSIVE': {
      const isFirstStep = (state.offensiveStep ?? 0) === 0

      const potentialTargets = Object.values(state.regionDict).filter(r => {
        if (r.fraction !== Fraction.Partisan) return false

        if (isFirstStep)
          return r.size > CITY_THRESHOLD

        return state.pursuitTargets?.includes(r.name)
      })

      const offensiveAttacks: OffensiveAttack[] = potentialTargets
        .map(target => {
          const germanNeighbors = target.neighbors
            .map(name => state.regionDict[name])
            .filter(n => n.fraction === Fraction.German)

          if (germanNeighbors.length === 0) return null

          const offensiveRegion = germanNeighbors.reduce((prev, current) => {
            const prevSum = Object.values(prev.garrison).reduce((a, b) => (a || 0) + (b || 0), 0)
            const currSum = Object.values(current.garrison).reduce((a, b) => (a || 0) + (b || 0), 0)
            return currSum > prevSum ? current : prev
          })

          return {
            attackingRegion: offensiveRegion.name,
            targetRegion: target.name,
            offensiveTroops: { infantry: 0 }
          }
        })
        .filter((a): a is OffensiveAttack => a !== null)

      if (offensiveAttacks.length === 0)
        return reducer({ ...state, offensiveStep: 0, pursuitTargets: [] }, { type: 'DO_BOMBING' })

      return {
        ...state,
        phase: GamePhase.ENEMY_OFFENSIVE,
        offensiveAttacks,
        offensiveAnimationIndex: 0,
        pursuitTargets: [],
        currentOffensive: isFirstStep ? (state.currentOffensive || 0) + 1 : state.currentOffensive,
        battleQueue: []
      }
    }

    case 'APPLY_OFFENSIVE_RESULTS': {
      const attack = state.offensiveAttacks[action.eventIndex]
      if (!attack) return state

      const target = state.regionDict[attack.targetRegion]
      const source = state.regionDict[attack.attackingRegion]

      const partisanCount = Object.values(target.garrison).reduce((a, b) => (a || 0) + (b || 0), 0)
      const forceMultiplier = 6
      const requiredPower = Math.max(partisanCount * forceMultiplier, 100)

      const forcedOffensiveTroops: Troops = {
        infantry: Math.floor(requiredPower * 0.90),
        [UnitType.artillery]: Math.floor(requiredPower * 0.06),
        [UnitType.tanks]: Math.floor(requiredPower * 0.04),
        [UnitType.aircraft]: source.garrison[UnitType.aircraft] || 0
      }

      const newRegionDict = {
        ...state.regionDict,
        [attack.targetRegion]: {
          ...target,
          attackingForces: forcedOffensiveTroops,
          attackingFraction: Fraction.German
        }
      }

      return {
        ...state,
        regionDict: newRegionDict,
        battleQueue: state.battleQueue.includes(attack.targetRegion)
          ? state.battleQueue
          : [...state.battleQueue, attack.targetRegion]
      }
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
        return { ...state, bombings: [], bombingIndex: 0, phase: GamePhase.ATTACK_PHASE }

      return { ...state, bombings, bombingIndex: 0, phase: GamePhase.BOMBING_PHASE }
    }

    case 'APPLY_BOMBING_RESULTS': {
      const bombing = state.bombings[action.eventIndex]
      if (!bombing) return state

      const updatedRegionDict = bombing.targets.reduce((acc, t) => {
        const region = acc[t.regionName]
        if (t.isShotDown) {
          const source = acc[bombing.bombingFrom]
          acc[bombing.bombingFrom] = {
            ...source,
            garrison: {
              ...source.garrison,
              aircraft: Math.max(0, (source.garrison.aircraft ?? 0) - 1)
            }
          }
        } else
          acc[t.regionName] = {
            ...region,
            garrison: {
              ...region.garrison,
              infantry: Math.max(0, (region.garrison.infantry ?? 0) - t.damage)
            }
          }

        return acc
      }, { ...state.regionDict })

      return { ...state, regionDict: updatedRegionDict }
    }

    case 'END_BATTLE': {
      const { regionName, winner, survivors } = action
      const currentRegion = state.regionDict[regionName]

      const updatedRegionDict = {
        ...state.regionDict,
        [regionName]: {
          ...currentRegion,
          fraction: winner,
          garrison: survivors,
          attackingForces: undefined,
          attackingFraction: undefined
        }
      }

      const battleQueue = state.battleQueue.filter(name => name !== regionName)
      const newState = { ...state, regionDict: updatedRegionDict, battleQueue, selected: null }

      if (battleQueue.length === 0) {
        const currentStep = state.offensiveStep ?? 0
        const isOffensiveActive = (state.offensiveAttacks?.length ?? 0) > 0

        if (isOffensiveActive) {
          if (currentStep < 2 && (state.pursuitTargets?.length ?? 0) > 0)
            return reducer({ ...newState, offensiveStep: currentStep + 1 }, { type: 'START_OFFENSIVE' })

          return reducer({ ...newState, offensiveStep: 0, offensiveAttacks: [], pursuitTargets: [] }, { type: 'START_MOBILIZATION' })
        }

        return reducer(newState, { type: 'START_MOBILIZATION' })
      }

      return newState
    }

    case 'SELECT_ATTACKING_REGION':
      return { ...state, selectedAttackingRegion: action.regionName }

    case 'RETREAT': {
      const { regionName, retreatingRegion, retreatingTroops } = action
      const targetRegion = state.regionDict[retreatingRegion]
      const sourceRegion = state.regionDict[regionName]
      const isBreakthrough = targetRegion.fraction === Fraction.German

      const pursuitTargets = [...(state.pursuitTargets ?? []), retreatingRegion]

      const updatedSource: RegionState = {
        ...sourceRegion,
        fraction: Fraction.German,
        garrison: sourceRegion.attackingForces ?? { infantry: 0 },
        attackingForces: undefined,
        attackingFraction: undefined
      }

      const updatedTarget: RegionState = isBreakthrough
        ? {
          ...targetRegion,
          attackingForces: retreatingTroops,
          attackingFraction: Fraction.Partisan
        }
        : {
          ...targetRegion,
          garrison: Object.values(UnitType).reduce((acc, unit) => ({
            ...acc,
            [unit]: (targetRegion.garrison[unit] ?? 0) + (retreatingTroops[unit] ?? 0)
          }), {} as Troops)
        }

      const updatedRegionDict = {
        ...state.regionDict,
        [regionName]: updatedSource,
        [retreatingRegion]: updatedTarget
      }

      const baseQueue = state.battleQueue.filter(name => name !== regionName)
      const newBattleQueue = isBreakthrough && !baseQueue.includes(retreatingRegion)
        ? [retreatingRegion, ...baseQueue]
        : baseQueue

      const newState = {
        ...state,
        regionDict: updatedRegionDict,
        battleQueue: newBattleQueue,
        pursuitTargets,
        selected: updatedRegionDict[retreatingRegion],
        selectedAttackingRegion: undefined
      }

      if (newBattleQueue.length === 0) {
        const currentStep = state.offensiveStep ?? 0
        const isOffensiveActive = (state.offensiveAttacks?.length ?? 0) > 0

        if (isOffensiveActive) {
          if (currentStep < 2)
            return reducer({ ...newState, offensiveStep: currentStep + 1 }, { type: 'START_OFFENSIVE' })

          return reducer({ ...newState, offensiveStep: 0, offensiveAttacks: [], pursuitTargets: [] }, { type: 'START_MOBILIZATION' })
        }
        return reducer(newState, { type: 'START_MOBILIZATION' })
      }

      return newState
    }

    case 'START_MOBILIZATION': {
      const MOB_RATE = 0.005
      const MAX_LIMIT_PERCENT = 0.15

      const updatedRegions = Object.keys(state.regionDict).reduce((acc, regionName) => {
        const region = state.regionDict[regionName]

        if (region.fraction === Fraction.German) {
          const wasInOffensive = state.offensiveAttacks.some(a => a.targetRegion === regionName)

          if (wasInOffensive || region.size > CITY_THRESHOLD)
            acc[regionName] = {
              ...region,
              garrison: initGarrison(region.population, Fraction.German),
              lastMobilizedCount: 0
            }
          else
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
            infantry: (region.garrison.infantry ?? 0) + actualAdded
          }
        }

        return acc
      }, {} as Record<string, RegionState>)

      return {
        ...state,
        regionDict: updatedRegions,
        phase: GamePhase.MOBILIZATION_PHASE,
        selected: null,
        offensiveStep: 0,
        pursuitTargets: [],
        offensiveAttacks: []
      }
    }

    default:
      return state
  }
}