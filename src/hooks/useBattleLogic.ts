import { useState, useCallback } from 'react'
import { UnitProps } from '../components/Unit/Unit'
import { Fraction } from '../types/types'
import { roll } from '../utils/math'
import { UNIT_STRENGTH } from '../config/units'
import { initArmy } from '../components/Battle/utils'

const MAX_MODIFIER_PERCENT = 1 / 2
const MAX_MODIFIER = MAX_MODIFIER_PERCENT / 100

export const useBattleLogic = (region: any) => {
  const [germans, setGermans] = useState<UnitProps[]>(() =>
    initArmy(region.garrison, Fraction.German, [0, window.innerWidth * 0.4])
  )
  const [partisans, setPartisans] = useState<UnitProps[]>(() =>
    initArmy(region.attackingForces!, Fraction.Partisan, [window.innerWidth * 0.6, window.innerWidth])
  )

  const calculateHits = useCallback((units: UnitProps[], rollValue: number, fraction: Fraction): number => {
    const normalizedRoll = (rollValue - 1) / 5
    const modifier = fraction === Fraction.Partisan
      ? normalizedRoll * 2 * MAX_MODIFIER - MAX_MODIFIER
      : MAX_MODIFIER - normalizedRoll * 2 * MAX_MODIFIER

    return units.reduce((total, unit) => {
      const baseAttack = UNIT_STRENGTH[unit.type]
      let hit = roll() <= baseAttack

      if ((modifier > 0 && !hit) || (modifier < 0 && hit))
        hit = Math.random() < Math.abs(modifier) ? !hit : hit

      return hit ? total + 1 : total
    }, 0)
  }, [])

  const getVictims = useCallback((units: UnitProps[], hits: number): string[] => {
    let remainingHits = hits
    const victims: string[] = []
    for (const unit of units) {
      const defense = UNIT_STRENGTH[unit.type]
      if (remainingHits >= defense) {
        remainingHits -= defense
        victims.push(unit.id)
      }
    }
    return victims
  }, [])

  const hasBothSides = partisans.length > 0 && germans.length > 0

  return {
    germans,
    setGermans,
    partisans,
    setPartisans,
    calculateHits,
    getVictims,
    hasBothSides
  }
}