import { useState, useEffect, useCallback } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import styles from './Battle.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Unit, { UnitProps } from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, Troops } from '../../types/types'
import { roll } from '../../utils/math'
import { initArmy } from './utils'
import { UNIT_STRENGTH } from '../../config/units'

const REMOVAL_TIME = 1500
const MAX_MODIFIER_PERCENT = 1 / 2
const MAX_MODIFIER = MAX_MODIFIER_PERCENT / 100

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [germans, setGermans] = useState<UnitProps[]>(() =>
    initArmy(region.garrison, Fraction.German, [0, window.innerWidth * 0.4])
  )
  const [partisans, setPartisans] = useState<UnitProps[]>(() =>
    initArmy(region.attackingForces!, Fraction.Partisan, [window.innerWidth * 0.6, window.innerWidth])
  )

  const [winner, setWinner] = useState<Fraction | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())
  const [shootingUnits, setShootingUnits] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isAnimating) return
    if (germans.length === 0 && partisans.length > 0) setWinner(Fraction.Partisan)
    else if (partisans.length === 0 && germans.length > 0) setWinner(Fraction.German)
  }, [germans.length, partisans.length, isAnimating])

  const calculateHits = (units: UnitProps[], rollValue: number, fraction: Fraction): number => {
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
  }

  const getVictims = (units: UnitProps[], hits: number): string[] => {
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
  }

  const animateRemoval = useCallback(async(
    victimIds: string[],
    setArmy: React.Dispatch<React.SetStateAction<UnitProps[]>>
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

  const triggerShooting = (units: UnitProps[]) => {
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
    if (winner || isAnimating) return

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

  const handleFinishBattle = () => {
    if (!winner) return
    const survivingArmy = winner === Fraction.German ? germans : partisans
    const survivors: Troops = survivingArmy.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    dispatch({
      type: 'END_BATTLE',
      regionName: region.name,
      winner,
      survivors
    })
  }

  const retreat = () => {
    const garrison: Troops = germans.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    const retreatingTroops: Troops = germans.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    dispatch({
      type: 'RETREAT',
      regionName: region.name,
      garrison,
      retreatingTroops,
      retreatingRegion: liberatedNeighbors[0],
    })
  }

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      <div className={styles.scoreBoard}>
        <div>Germans: {germans.length} Partisans: {partisans.length}</div>
      </div>

      {germans.map(u => (
        <Unit
          id={u.id}
          key={u.id}
          fraction={u.fraction}
          type={u.type}
          position={u.position}
          isDying={dyingUnits.has(u.id)}
          isShooting={shootingUnits.has(u.id)}
        />
      ))}
      {partisans.map(u => (
        <Unit
          id={u.id}
          key={u.id}
          fraction={u.fraction}
          type={u.type}
          position={u.position}
          isDying={dyingUnits.has(u.id)}
          isShooting={shootingUnits.has(u.id)}
        />
      ))}

      {!winner && <Dice className={styles.dice} callback={handleBattleRound} />}

      {winner && (
        <div className={shared.blackModal}>
          <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
          <p>{winner === Fraction.Partisan ? 'Another Yugoslav town has been liberated!' : 'Your forces have suffered a heavy blow.'}</p>
          <button onClick={handleFinishBattle} className={shared.button}>Back to map</button>
        </div>
      )}
      <button className={shared.roundButton} onClick={retreat}>Retreat</button>
    </div>
  )
}

export default Battle