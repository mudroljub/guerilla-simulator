import { useState, useCallback } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit, { UnitProps } from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, AnimState } from '../../types/types'
import EndModal from './EndModal'
import BattleUI from './BattleUI'
import Retreat from './Retreat'
import { mapUnitsToTroops, sleep } from '../../utils/helpers'
import { roll } from '../../utils/math'
import { UNIT_STRENGTH } from '../../config/units'
import { initArmy } from './utils'

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
  const [processing, setProcessing] = useState(false)

  const calculateHits = useCallback((units: UnitProps[], rollValue: number, fraction: Fraction): number => {
    const normalizedRoll = (rollValue - 1) / 5

    const modifier =
      fraction === Fraction.Partisan
        ? normalizedRoll * 2 * MAX_MODIFIER - MAX_MODIFIER
        : MAX_MODIFIER - normalizedRoll * 2 * MAX_MODIFIER

    return units.reduce((total, unit) => {
      const baseAttack = UNIT_STRENGTH[unit.type]
      let hit = roll() <= baseAttack

      if ((modifier > 0 && !hit) || (modifier < 0 && hit))
        hit = Math.random() < Math.abs(modifier) ? !hit : hit

      return hit ? total + 1 : total
    }, 0)
  }, [])

  const getVictims = useCallback((units: UnitProps[], hits: number): string[] => {
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
  }, [])

  const hasBothSides = partisans.length > 0 && germans.length > 0

  const handleBattleRound = async(rollValue: number) => {
    if (processing || !hasBothSides) return

    setProcessing(true)

    setGermans(prev => prev.map(u => ({ ...u, state: AnimState.shooting })))
    setPartisans(prev => prev.map(u => ({ ...u, state: AnimState.shooting })))

    await sleep(900)

    const gVictims = getVictims(germans, calculateHits(partisans, rollValue, Fraction.Partisan))
    const pVictims = getVictims(partisans, calculateHits(germans, rollValue, Fraction.German))

    setGermans(prev => prev.map(u => ({
      ...u,
      state: gVictims.includes(u.id) ? AnimState.dying : AnimState.battle
    })))

    setPartisans(prev => prev.map(u => ({
      ...u,
      state: pVictims.includes(u.id) ? AnimState.dying : AnimState.battle
    })))

    await sleep(1500)

    setGermans(prev => prev.filter(u => !gVictims.includes(u.id)))
    setPartisans(prev => prev.filter(u => !pVictims.includes(u.id)))

    setProcessing(false)
  }

  const handleRetreat = (targetRegion: string) => {
    dispatch({
      type: 'RETREAT',
      regionName: region.name,
      garrison: mapUnitsToTroops(germans),
      retreatingTroops: mapUnitsToTroops(partisans),
      retreatingRegion: targetRegion,
    })
  }

  return (
    <div className={styles.container}>
      <BattleUI
        regionName={region.name}
        germans={germans.length}
        partisans={partisans.length}
      />

      {[...germans, ...partisans].map(u => (
        <Unit key={u.id} {...u} />
      ))}

      {hasBothSides && (
        <Dice className={styles.dice} callback={handleBattleRound} />
      )}

      {!hasBothSides && (
        <EndModal regionName={region.name} germans={germans} partisans={partisans} />
      )}

      <Retreat
        liberatedNeighbors={liberatedNeighbors}
        onConfirm={handleRetreat}
        disabled={processing || liberatedNeighbors.length === 0}
      />
    </div>
  )
}

export default Battle