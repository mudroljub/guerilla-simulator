import { useState, useEffect } from 'react'
import { useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit from '../Unit/Unit'
import { Fraction, GamePhase } from '../../types/types'
import { roll } from '../../utils/math'
import Dice from '../Dice/Dice'
import { BattleUnit, initArmy } from './utils'
import { UNIT_STRENGTH } from '../../config/units'

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

  useEffect(() => {
    if (germans.length === 0 && partisans.length > 0)
      setWinner(Fraction.Partisan)
    else if (partisans.length === 0 && germans.length > 0)
      setWinner(Fraction.German)

  }, [germans.length, partisans.length])

  const calculateHits = (units: BattleUnit[], bonus: number): number =>
    units.reduce((total, unit) => {
      const attack = UNIT_STRENGTH[unit.type] + bonus
      return roll() <= attack ? total + 1 : total
    }, 0)

  const applyHits = (units: BattleUnit[], hits: number): BattleUnit[] => {
    let remainingHits = hits
    return units.filter(unit => {
      const defense = UNIT_STRENGTH[unit.type]
      if (remainingHits >= defense) {
        remainingHits -= defense
        return false
      }
      return true
    })
  }

  const handleBattleRound = (rollValue: number) => {
    if (winner) return

    const normalizedRoll = (rollValue - 1) / 5
    const partisanBonus = -1.5 + (normalizedRoll * 3.0)
    const germanBonus = 1.5 - (normalizedRoll * 3.0)

    const p_hits = calculateHits(partisans, partisanBonus)
    const g_hits = calculateHits(germans, germanBonus)

    setGermans(prev => applyHits(prev, p_hits))
    setPartisans(prev => applyHits(prev, g_hits))
  }

  const handleFinishBattle = () => {
    // TODO: ažurirati reducer, novo stanje trupa
    dispatch({ type: 'SET_PHASE', phase: GamePhase.COMBAT_MOVE })
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

      {!winner && <Dice className={styles.dice} callback={handleBattleRound} />}

      {winner && (
        <div>
          <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
          <p>
            {winner === Fraction.Partisan
              ? 'Another Yugoslav town has been liberated!'
              : 'Partisan forces have suffered a heavy blow.'}
          </p>
          <button onClick={handleFinishBattle}>
              Return to Map
          </button>
        </div>
      )}
    </div>
  )
}

export default Battle