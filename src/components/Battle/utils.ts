import { v4 as uuidv4 } from 'uuid'
import { Fraction, Troops, UnitType } from '../../types/types'
import { randomInRange, range } from '../../utils/math'
import { UnitProps } from '../Unit/Unit'

export const initUnits = (count: number, fraction: Fraction, type: UnitType, xRange: [number, number]): UnitProps[] =>
  range(count || 0, () => ({
    id: uuidv4(),
    fraction,
    type,
    position: {
      x: randomInRange(xRange[0], xRange[1]),
      y: randomInRange(0, window.innerHeight),
    }
  }))

export const initArmy = (
  troops: Troops,
  fraction: Fraction,
  xRange: [number, number]
): UnitProps[] => [UnitType.infantry, UnitType.artillery, UnitType.tanks]
  .flatMap(type => initUnits(troops?.[type] || 0, fraction, type, xRange))
  .sort(() => Math.random() - 0.5)
