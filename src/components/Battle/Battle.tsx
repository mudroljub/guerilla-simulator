import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, Troops } from '../../types/types'
import { roll } from '../../utils/math'
import { BattleUnit, initArmy } from './utils'
import { UNIT_STRENGTH } from '../../config/units'

const REMOVAL_TIME = 200

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]

  const [germans, setGermans] = useState<BattleUnit[]>(() =>
    initArmy(region.garrison, Fraction.German, [0, window.innerWidth * 0.4])
  )
  const [partisans, setPartisans] = useState<BattleUnit[]>(() =>
    initArmy(region.attackingForces!, Fraction.Partisan, [window.innerWidth * 0.6, window.innerWidth])
  )

  const [winner, setWinner] = useState<Fraction | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [diceValue, setDiceValue] = useState<number | null>(null)

  useEffect(() => {
    if (isAnimating) return
    if (germans.length === 0 && partisans.length > 0) setWinner(Fraction.Partisan)
    else if (partisans.length === 0 && germans.length > 0) setWinner(Fraction.German)
  }, [germans.length, partisans.length, isAnimating])

  const calculateHits = (units: BattleUnit[], bonus: number): number =>
    units.reduce((total, unit) => {
      const attack = UNIT_STRENGTH[unit.type] + bonus
      return roll() <= attack ? total + 1 : total
    }, 0)

  const getVictims = (units: BattleUnit[], hits: number): string[] => {
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
    setArmy: React.Dispatch<React.SetStateAction<BattleUnit[]>>
  ) => {
    if (victimIds.length === 0) return

    for (const id of victimIds) {
      await new Promise(resolve => setTimeout(resolve, REMOVAL_TIME))
      setArmy(prev => prev.filter(u => u.id !== id))
    }
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

      <div className={styles.battlefield}>
        {germans.map(u => (
          <Unit key={u.id} fraction={u.fraction} unitType={u.type} position={{ x: u.x, y: u.y }} />
        ))}
        {partisans.map(u => (
          <Unit key={u.id} fraction={u.fraction} unitType={u.type} position={{ x: u.x, y: u.y }} />
        ))}
      </div>

      {!winner && <Dice className={styles.dice} callback={handleBattleRound} value={diceValue} />}

      {winner && (
        <div className={styles.victoryScreen}>
          <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
          <p>{winner === Fraction.Partisan ? 'Another Yugoslav town has been liberated!' : 'Your forces have suffered a heavy blow.'}</p>
          <button onClick={handleFinishBattle}>End battle</button>
        </div>
      )}
    </div>
  )
}

export default Battle