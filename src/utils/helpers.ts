import { UnitProps } from '../components/Unit/Unit'
import { Troops } from '../types/types'

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mapUnitsToTroops = (units: UnitProps[]): Troops =>
  units.reduce((acc, unit) => {
    acc[unit.type] = (acc[unit.type] || 0) + 1
    return acc
  }, {} as Troops)