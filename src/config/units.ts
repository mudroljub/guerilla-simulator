import { UnitType } from '../types/types'

export const UNIT_STRENGTH: Record<UnitType, number> = {
  [UnitType.infantry]: 1,
  [UnitType.artillery]: 2,
  [UnitType.tanks]: 3,
  [UnitType.aircraft]: 4,
}

/* Axis & Allies (modified) */

export const infantry = {
  attack: 1,
  defense: 2,
  move: 1,
  cost: 3,
}

export const artillery = {
  attack: 2,
  defense: 2,
  move: 1,
  cost: 4,
}

export const tanks = {
  attack: 3,
  defense: 2,
  move: 2,
  cost: 5,
}

export const aircraft = {
  attack: 4,
  defense: 2,
  move: 4,
  cost: 10,
}