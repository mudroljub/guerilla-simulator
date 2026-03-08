import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../../store/store'
import styles from './Battle.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Unit, { UnitProps } from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, Troops } from '../../types/types'
import { roll } from '../../utils/math'
import { initArmy } from './utils'
import { UNIT_STRENGTH } from '../../config/units'

const REMOVAL_TIME = 1500

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]

  const [germans, setGermans] = useState<UnitProps[]>(() =>
    initArmy(region.garrison, Fraction.German, [0, window.innerWidth * 0.4])
  )
  const [partisans, setPartisans] = useState<UnitProps[]>(() =>
    initArmy(region.attackingForces!, Fraction.Partisan, [window.innerWidth * 0.6, window.innerWidth])
  )

  const [winner, setWinner] = useState<Fraction | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [dyingUnits, setDyingUnits] = useState<Set<string>>(new Set())
  const [shootingUnits, setShootingUnits] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isAnimating) return
    if (germans.length === 0 && partisans.length > 0) setWinner(Fraction.Partisan)
    else if (partisans.length === 0 && germans.length > 0) setWinner(Fraction.German)
  }, [germans.length, partisans.length, isAnimating])

  const calculateHits = (units: UnitProps[], bonus: number): number =>
    units.reduce((total, unit) => {
      const attack = UNIT_STRENGTH[unit.type] + bonus
      return roll() <= attack ? total + 1 : total
    }, 0)

  const getVictims = (units: UnitProps[], hits: number): string[] => {
    let remainingHits = hits
    const victims: string[] = []
    for (const unit of units) {
      const defense = UNIT_STRENGTH[unit.type]
      if (remainingHits >= defense) {
        remainingHits -= defense
        victims.push(unit.key)
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

    setArmy(prev => prev.filter(u => !victimIds.includes(u.key)))
    setDyingUnits(prev => {
      const newSet = new Set(prev)
      victimIds.forEach(key => newSet.delete(key))
      return newSet
    })
  }, [])

  const handleBattleRound = async(rollValue: number) => {
    if (winner || isAnimating) return

    setDiceValue(rollValue)
    setIsAnimating(true)

    const normalizedRoll = (rollValue - 1) / 5
    const partisanBonus = -1.5 + (normalizedRoll * 3.0)
    const germanBonus = 1.5 - (normalizedRoll * 3.0)

    const p_hits = calculateHits(partisans, partisanBonus)
    const g_hits = calculateHits(germans, germanBonus)

    const g_victims = getVictims(germans, p_hits)
    const p_victims = getVictims(partisans, g_hits)

    const triggerShooting = (units: UnitProps[]) => {
      units.forEach(u => {
        const delay = Math.random() * 200
        setTimeout(() => {
          setShootingUnits(prev => new Set(prev).add(u.key))
          setTimeout(() => {
            setShootingUnits(prev => {
              const newSet = new Set(prev)
              newSet.delete(u.key)
              return newSet
            })
          }, 200)
        }, delay)
      })
    }

    triggerShooting(germans, -1)
    triggerShooting(partisans, 1)

    await Promise.all([
      animateRemoval(g_victims, setGermans),
      animateRemoval(p_victims, setPartisans)
    ])

    setDiceValue(null)
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

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      <div className={styles.scoreBoard}>
        <div>Germans: {germans.length}</div>
        <div>Partisans: {partisans.length}</div>
      </div>

      {germans.map(u => (
        <Unit
          key={u.key}
          fraction={u.fraction}
          type={u.type}
          position={u.position}
          isDying={dyingUnits.has(u.key)}
          isShooting={shootingUnits.has(u.key)}
        />
      ))}
      {partisans.map(u => (
        <Unit
          key={u.key}
          fraction={u.fraction}
          type={u.type}
          position={u.position}
          isDying={dyingUnits.has(u.key)}
          isShooting={shootingUnits.has(u.key)}
        />
      ))}

      {!winner && <Dice className={styles.dice} callback={handleBattleRound} value={diceValue} />}

      {winner && (
        <div className={shared.blackModal}>
          <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
          <p>{winner === Fraction.Partisan ? 'Another Yugoslav town has been liberated!' : 'Your forces have suffered a heavy blow.'}</p>
          <button onClick={handleFinishBattle} className={shared.button}>Back to map</button>
        </div>
      )}
    </div>
  )
}

export default Battle