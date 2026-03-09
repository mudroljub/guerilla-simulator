import { useState, useCallback } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { useBattleLogic } from '../../hooks/useBattleLogic'
import styles from './Battle.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Unit from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, Troops } from '../../types/types'
import EndModal from './EndModal'

const REMOVAL_TIME = 1500

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const {
    germans,
    setGermans,
    partisans,
    setPartisans,
    calculateHits,
    getVictims,
    hasBothSides
  } = useBattleLogic(region)

  const [isAnimating, setIsAnimating] = useState(false)
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())
  const [shootingUnits, setShootingUnits] = useState<Set<string>>(new Set())

  const animateRemoval = useCallback(async(
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

  const triggerShooting = (units: any[]) => {
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
  }

  const handleBattleRound = async(rollValue: number) => {
    if (!hasBothSides || isAnimating) return

    setIsAnimating(true)

    const p_hits = calculateHits(partisans, rollValue, Fraction.Partisan)
    const g_hits = calculateHits(germans, rollValue, Fraction.German)

    const g_victims = getVictims(germans, p_hits)
    const p_victims = getVictims(partisans, g_hits)

    triggerShooting(germans)
    triggerShooting(partisans)

    await Promise.all([
      animateRemoval(g_victims, setGermans),
      animateRemoval(p_victims, setPartisans)
    ])

    setIsAnimating(false)
  }

  const retreat = () => {
    const mapToTroops = (units: any[]) => units.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    dispatch({
      type: 'RETREAT',
      regionName: region.name,
      garrison: mapToTroops(germans),
      retreatingTroops: mapToTroops(germans), // Ispravio sam ovo da koristi istu logiku
      retreatingRegion: liberatedNeighbors[0],
    })
  }

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      <div className={styles.scoreBoard}>
        <div>Germans: {germans.length} Partisans: {partisans.length}</div>
      </div>

      {[...germans, ...partisans].map(u => (
        <Unit
          key={u.id}
          {...u}
          isDying={dyingUnits.has(u.id)}
          isShooting={shootingUnits.has(u.id)}
        />
      ))}

      {hasBothSides && <Dice className={styles.dice} callback={handleBattleRound} />}

      {!hasBothSides && (
        <EndModal region={region} germans={germans} partisans={partisans} />
      )}
      <button className={shared.roundButton} onClick={retreat}>Retreat</button>
    </div>
  )
}

export default Battle