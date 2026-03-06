import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit from '../Unit/Unit'
import { Fraction, UnitType } from '../../types/types'
import { randomInRange, range, roll } from '../../utils/math'
import Dice from '../Dice/Dice'

interface BattleUnit {
  id: string
  fraction: Fraction
  type: UnitType
  x: number
  y: number
}

const UNIT_STRENGTH: Record<UnitType, number> = {
  [UnitType.infantry]: 1,
  [UnitType.artillery]: 2,
  [UnitType.tanks]: 3,
  [UnitType.aircraft]: 4,
}

const unitTypes = [UnitType.infantry, UnitType.artillery, UnitType.tanks]

const createUnits = (count: number, fraction: Fraction, type: UnitType, xRange: [number, number]): BattleUnit[] =>
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

  const [germans, setGermans] = useState<BattleUnit[]>(() =>
    unitTypes.flatMap(type => createUnits(
      region.garrison[type] || 0, Fraction.German, type, [0, window.innerWidth * 0.4]
    ))
  )

  const [partisans, setPartisans] = useState<BattleUnit[]>(() =>
    unitTypes.flatMap(type => createUnits(
      region.attackingForces?.[type] || 0, Fraction.Partisan, type, [window.innerWidth * 0.6, window.innerWidth]
    ))
  )

  const calculateHits = (units: BattleUnit[], bonus: number): number =>
    units.reduce((total, unit) => {
      const attack = UNIT_STRENGTH[unit.type] + bonus
      return roll() <= attack ? total + 1 : total
    }, 0)

  const applyHits = (units: BattleUnit[], hits: number): BattleUnit[] => {
    let remainingHits = hits
    return units.filter(unit => {
      const cost = UNIT_STRENGTH[unit.type]
      if (remainingHits >= cost) {
        remainingHits -= cost
        return false
      }
      return true
    })
  }

  const handleBattleRound = (roll: number) => {
    const normalizedRoll = (roll - 1) / 5
    const partisanBonus = -1.5 + (normalizedRoll * 3.0)
    const germanBonus = 1.5 - (normalizedRoll * 3.0)

    const p_hits = calculateHits(partisans, partisanBonus)
    const g_hits = calculateHits(germans, germanBonus)

    setGermans(prev => applyHits(prev, p_hits))
    setPartisans(prev => applyHits(prev, g_hits))
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