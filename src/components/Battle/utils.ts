import { v4 as uuidv4 } from 'uuid'
import { Fraction, Troops, UnitType } from '../../types/types'
import { randomInRange, range } from '../../utils/math'

export interface BattleUnit {
  id: string
  fraction: Fraction
  type: UnitType
  x: number
  y: number
}

export const initUnits = (count: number, fraction: Fraction, type: UnitType, xRange: [number, number]): BattleUnit[] =>
  range(count || 0, () => ({
    id: uuidv4(),
    fraction,
    type,
    x: randomInRange(xRange[0], xRange[1]),
    y: randomInRange(0, window.innerHeight),
  }))

export const initArmy = (
  troops: Troops,
  fraction: Fraction,
  xRange: [number, number]
): BattleUnit[] => [UnitType.infantry, UnitType.artillery, UnitType.tanks]
  .flatMap(type => initUnits(troops?.[type] || 0, fraction, type, xRange))
  .sort(() => Math.random() - 0.5)
