import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit from '../Unit/Unit'
import { Fraction, UnitType } from '../../types/types'
import { randomInRange, range } from '../../utils/math'
import Dice from '../Dice/Dice'

const UNIT_STRENGTH: Record<UnitType, number> = {
  [UnitType.infantry]: 1,
  [UnitType.artillery]: 2,
  [UnitType.tanks]: 3,
  [UnitType.aircraft]: 4,
}

const createUnits = (count: number, fraction: Fraction, type: UnitType, xRange: [number, number]) =>
  range(count || 0, () => ({
    id: uuidv4(),
    fraction,
    type,
    x: randomInRange(xRange[0], xRange[1]),
    y: randomInRange(0, window.innerHeight),
  }))

const Battle = () => {
  const { state } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]

  const [germans, setGermans] = useState(() =>
    [UnitType.infantry, UnitType.artillery, UnitType.tanks].flatMap(type =>
      createUnits(region.garrison[type] || 0, Fraction.German, type, [0, window.innerWidth * 0.4])
    )
  )

  const [partisans, setPartisans] = useState(() =>
    createUnits(region.attackingForces?.infantry || 0, Fraction.Partisan, UnitType.infantry, [window.innerWidth * 0.6, window.innerWidth])
  )

  const calculateHits = (units: any[], bonus: number) => units.reduce((total, unit) => {
    const baseStrength = UNIT_STRENGTH[unit.type as UnitType] || 1

    // Novi prag: bazična snaga + tvoj linearni bonus
    const effectiveStrength = baseStrength + bonus

    // Bacamo "nevidljivu" kocku (1-6)
    const roll = Math.random() * 6

    return roll <= effectiveStrength ? total + 1 : total
  }, 0)

  const handleBattleRound = (roll: number) => {
    const normalizedRoll = (roll - 1) / 5

    // bonus od -1.5 do 1.5
    const partisanBonus = -1.5 + (normalizedRoll * 3.0)
    const germanBonus = 1.5 - (normalizedRoll * 3.0)

    const p_hits = calculateHits(partisans, partisanBonus)
    const g_hits = calculateHits(germans, germanBonus)

    setGermans(prev => prev.slice(0, Math.max(0, prev.length - p_hits)))
    setPartisans(prev => prev.slice(0, Math.max(0, prev.length - g_hits)))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bitka za {region.name}</h1>
        <div className={styles.scoreBoard}>
          <div className={styles.germanSide}>Švabe: {germans.length}</div>
          <div className={styles.partisanSide}>Partizani: {partisans.length}</div>
        </div>
      </div>

      <div className={styles.battlefield}>
        {germans.map(u => (
          <Unit key={u.id} fraction={u.fraction} unitType={u.type} position={{ x: u.x, y: u.y }} />
        ))}
        {partisans.map(u => (
          <Unit key={u.id} fraction={u.fraction} unitType={u.type} position={{ x: u.x, y: u.y }} />
        ))}
      </div>

      <Dice className={styles.dice} callback={handleBattleRound} />
    </div>
  )
}

export default Battle