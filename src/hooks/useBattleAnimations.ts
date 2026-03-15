import { useState, useCallback } from 'react'
import { sleep } from '../utils/helpers'

const REMOVAL_DURATION = 1500
const MAX_SHOOT_DELAY = 400
const SHOOT_DURATION = 200

export const useBattleAnimations = () => {
  const [shootingUnits, setShootingUnits] = useState<Set<string>>(new Set())
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())

  const triggerShooting = useCallback(async(units: any[]) => {
    units.forEach(async u => {
      const delay = Math.random() * MAX_SHOOT_DELAY

      await sleep(delay)
      setShootingUnits(prev => new Set(prev).add(u.id))

      await sleep(SHOOT_DURATION)
      setShootingUnits(prev => {
        const newSet = new Set(prev)
        newSet.delete(u.id)
        return newSet
      })
    })
  }, [])

  const animateRemoval = useCallback(async(
    victimIds: string[],
    setArmy: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (victimIds.length === 0) return

    setDyingUnits(prev => new Set([...Array.from(prev), ...victimIds]))

    await new Promise(resolve => setTimeout(resolve, REMOVAL_DURATION))

    setArmy(prev => prev.filter(u => !victimIds.includes(u.id)))
    setDyingUnits(prev => {
      const newSet = new Set(prev)
      victimIds.forEach(key => newSet.delete(key))
      return newSet
    })
  }, [])

  return {
    dyingUnits,
    shootingUnits,
    animateRemoval,
    triggerShooting
  }
}