import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from 'react'
import { reducer, Action } from './reducer'
import { BombingMission, Fraction, GamePhase, RegionData, RegionState, OffensiveAttack } from '../types/types'
import { initRegionState } from '../utils/initRegionState'
import { CITY_THRESHOLD } from '../config'

export type RegionDict = Record<string, RegionState>

export interface MapState {
  regionDict: RegionDict
  selected: RegionState | null
  phase: GamePhase
  battleQueue: string[]
  currentOffensive: number
  bombings: BombingMission[]
  bombingIndex: number
  offensiveAttacks: OffensiveAttack[]
  offensiveAnimationIndex: number
  offensives: string[]
  selectedAttackingRegion?: string
}

interface Store {
  state: MapState
  dispatch: Dispatch<Action>
}

const MapContext = createContext<Store | undefined>(undefined)

const initialState = (regions: RegionData[]): MapState => {
  const regionDict: RegionDict = {}
  for (const region of regions)
    regionDict[region.name] = initRegionState(region)

  return {
    selected: null,
    regionDict,
    phase: GamePhase.ATTACK_PHASE,
    battleQueue: [],
    bombings: [],
    bombingIndex: 0,
    offensives: [],
    currentOffensive: 0,
    offensiveAttacks: [],
    offensiveAnimationIndex: 0
  }
}

/** PROVIDER */

export function Provider({ regions, children }: { regions: RegionData[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, regions, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

/** HOOKS */

export const useStore = (): Store => {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useStore must be used within MapProvider')
  return ctx
}

const getLiberatedNeighbors = (neighbors: string[], dict: RegionDict): string[] =>
  neighbors.filter(neighbor =>
    dict[neighbor].fraction === Fraction.Partisan &&
    (dict[neighbor].garrison.infantry ?? 0) > 0
  )

export const useLiberatedNeighbors = (regionName: string): string[] => {
  const { state: { regionDict } } = useStore()
  return useMemo(() =>
    getLiberatedNeighbors(regionDict[regionName].neighbors, regionDict),
  [regionName, regionDict])
}

export const useIsAttackable = (regionName: string): boolean => {
  const { state: { selected, regionDict } } = useStore()

  return useMemo(() =>
    selected?.name === regionName &&
    selected.fraction === Fraction.German &&
    getLiberatedNeighbors(selected.neighbors, regionDict).length > 0,
  [regionName, regionDict, selected])
}

export const useLiberatedCities = (): string[] => {
  const { state: { regionDict } } = useStore()

  return useMemo(() =>
    Object.values(regionDict)
      .filter(region => region.fraction === Fraction.Partisan && region.size > CITY_THRESHOLD)
      .map(region => region.name),
  [regionDict])
}