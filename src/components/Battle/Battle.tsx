import { useState } from 'react'
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

const Battle = () => {
  const { state, dispatch } = useStore()
  const region = state.regionDict[state.battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [armies, setArmies] = useState<Record<Fraction, UnitProps[]>>({
    [Fraction.German]: initArmy(region.garrison, Fraction.German, [0, window.innerWidth * 0.4]),
    [Fraction.Partisan]: initArmy(region.attackingForces!, Fraction.Partisan, [window.innerWidth * 0.6, window.innerWidth])
  })
  const [processing, setProcessing] = useState(false)

  const setAnim = (animation: AnimState, victims: Record<Fraction, string[]> = { [Fraction.German]: [], [Fraction.Partisan]: [] }) => {
    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].map(unit => ({ ...unit, state: victims[Fraction.German].includes(unit.id) ? AnimState.dying : animation })),
      [Fraction.Partisan]: prev[Fraction.Partisan].map(unit => ({ ...unit, state: victims[Fraction.Partisan].includes(unit.id) ? AnimState.dying : animation }))
    }))
  }

  const handleBattleRound = async(rollValue: number) => {
    if (processing || !armies[Fraction.German].length || !armies[Fraction.Partisan].length) return
    setProcessing(true)

    setAnim(AnimState.shooting)
    await sleep(900)

    const battleResults: Record<Fraction, string[]> = { [Fraction.German]: [], [Fraction.Partisan]: [] }

    for (const fraction of [Fraction.German, Fraction.Partisan]) {
      const isPartisan = fraction === Fraction.Partisan
      const attackers = isPartisan ? armies[Fraction.Partisan] : armies[Fraction.German]
      const defenders = isPartisan ? armies[Fraction.German] : armies[Fraction.Partisan]
      const targetFraction = isPartisan ? Fraction.German : Fraction.Partisan

      const normRoll = (rollValue - 1) / 5
      const modifier = isPartisan ? normRoll * 0.01 - 0.005 : 0.005 - normRoll * 0.01

      let totalHits = attackers.reduce((total, unit) => {
        let hit = roll() <= UNIT_STRENGTH[unit.type]
        if (Math.random() < Math.abs(modifier)) hit = !hit
        return hit ? total + 1 : total
      }, 0)

      for (const unit of defenders) {
        const defense = UNIT_STRENGTH[unit.type]
        if (totalHits >= defense) {
          totalHits -= defense
          battleResults[targetFraction].push(unit.id)
        }
      }
    }

    setAnim(AnimState.battle, battleResults)
    await sleep(1500)

    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].filter(unit => !battleResults[Fraction.German].includes(unit.id)),
      [Fraction.Partisan]: prev[Fraction.Partisan].filter(unit => !battleResults[Fraction.Partisan].includes(unit.id))
    }))

    setProcessing(false)
  }

  const hasBothSides = armies[Fraction.German].length > 0 && armies[Fraction.Partisan].length > 0

  return (
    <div className={styles.container}>
      <BattleUI
        regionName={region.name}
        germans={armies[Fraction.German].length}
        partisans={armies[Fraction.Partisan].length}
      />

      {[...armies[Fraction.German], ...armies[Fraction.Partisan]].map(unit => (
        <Unit key={unit.id} {...unit} />
      ))}

      {hasBothSides ? (
        <Dice className={styles.dice} callback={handleBattleRound} />
      ) : (
        <EndModal regionName={region.name} germans={armies[Fraction.German]} partisans={armies[Fraction.Partisan]} />
      )}

      <Retreat
        liberatedNeighbors={liberatedNeighbors}
        onConfirm={target => dispatch({
          type: 'RETREAT',
          regionName: region.name,
          garrison: mapUnitsToTroops(armies[Fraction.German]),
          retreatingTroops: mapUnitsToTroops(armies[Fraction.Partisan]),
          retreatingRegion: target,
        })}
        disabled={processing || !liberatedNeighbors.length}
      />
    </div>
  )
}

export default Battle