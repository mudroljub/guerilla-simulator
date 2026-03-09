import { useState, useCallback } from 'react'

const REMOVAL_TIME = 1500

export const useBattleAnimations = () => {
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())
  const [shootingUnits, setShootingUnits] = useState<Set<string>>(new Set())

  const animateRemoval = useCallback(async (
    victimIds: string[],
    setArmy: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (victimIds.length === 0) return

    setDyingUnits(prev => new Set([...Array.from(prev), ...victimIds]))

    await new Promise(resolve => setTimeout(resolve, REMOVAL_TIME))

    setArmy(prev => prev.filter(u => !victimIds.includes(u.id)))
    setDyingUnits(prev => {
      const newSet = new Set(prev)
      victimIds.forEach(key => newSet.delete(key))
      return newSet
    })
  }, [])

  const triggerShooting = useCallback((units: any[]) => {
    units.forEach(u => {
      const delay = Math.random() * 300
      setTimeout(() => {
        setShootingUnits(prev => new Set(prev).add(u.id))
        setTimeout(() => {
          setShootingUnits(prev => {
            const newSet = new Set(prev)
            newSet.delete(u.id)
            return newSet
          })
        }, 200)
      }, delay)
    })
  }, [])

  return {
    dyingUnits,
    shootingUnits,
    animateRemoval,
    triggerShooting
  }
}