import { useState, useCallback } from 'react'

const REMOVAL_DURATION = 1500

export const useBattleAnimations = () => {
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())

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
    animateRemoval,
  }
}