import { useState } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import styles from './Battle.module.scss'
import Unit, { UnitProps } from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, AnimState, GamePhase } from '../../types/types'
import BattleReport from './BattleReport'
import BattleUI from './BattleUI'
import Retreat from './Retreat'
import { mapUnitsToTroops, sleep } from '../../utils/helpers'
import { roll } from '../../utils/math'
import { UNIT_ROLLS } from '../../config/units'
import { initArmy } from './utils'

const Battle = () => {
  const { state, dispatch } = useStore()
  const { phase } = state
  const region = state.regionDict[state.battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [processing, setProcessing] = useState(false)

  const attackerFraction = region.attackingFraction || Fraction.Partisan
  const defenderFraction = attackerFraction === Fraction.Partisan ? Fraction.German : Fraction.Partisan

  const [armies, setArmies] = useState<Record<Fraction, UnitProps[]>>(() => {
    const LEFT_ZONE: [number, number] = [0, window.innerWidth * 0.4]
    const RIGHT_ZONE: [number, number] = [window.innerWidth * 0.6, window.innerWidth]

    const defenderUnits = initArmy(
      region.garrison,
      defenderFraction,
      defenderFraction === Fraction.German ? LEFT_ZONE : RIGHT_ZONE
    )

    const attackerUnits = initArmy(
      region.attackingForces!,
      attackerFraction,
      attackerFraction === Fraction.German ? LEFT_ZONE : RIGHT_ZONE
    )

    return {
      [defenderFraction]: defenderUnits,
      [attackerFraction]: attackerUnits
    } as Record<Fraction, UnitProps[]>
  })

  const setAnim = (anim: AnimState, victims: Record<Fraction, string[]> = { [Fraction.German]: [], [Fraction.Partisan]: [] }) =>
    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].map(u => ({ ...u, state: victims[Fraction.German].includes(u.id) ? AnimState.dying : anim })),
      [Fraction.Partisan]: prev[Fraction.Partisan].map(u => ({ ...u, state: victims[Fraction.Partisan].includes(u.id) ? AnimState.dying : anim }))
    }))

  const calculateHits = (attacker: UnitProps[], rollValue: number, fraction: Fraction) => {
    const modifier = 0.5 + ((rollValue - 1) / 5)

    const totalHits = attacker.reduce((total, unit) => {
      const hit = roll() <= UNIT_ROLLS[unit.type]
      return total + Number(hit)
    }, 0)

    return fraction === Fraction.Partisan
      ? Math.round(totalHits * modifier)
      : Math.round(totalHits * 2 - modifier)
  }

  const getVictims = (units: UnitProps[], hits: number) => {
    const victimIds: string[] = []
    let remainingHits = hits
    for (const unit of units) {
      const strength = UNIT_ROLLS[unit.type]
      if (remainingHits < strength) break
      remainingHits -= strength
      victimIds.push(unit.id)
    }
    return victimIds
  }

  const handleBattleRound = async(rollValue: number) => {
    if (processing || !armies[Fraction.German].length || !armies[Fraction.Partisan].length) return
    setProcessing(true)

    setAnim(AnimState.shooting)
    await sleep(900)

    const germanVictims = getVictims(armies[Fraction.German], calculateHits(armies[Fraction.Partisan], rollValue, Fraction.Partisan))
    const partisanVictims = getVictims(armies[Fraction.Partisan], calculateHits(armies[Fraction.German], rollValue, Fraction.German))

    setAnim(AnimState.battle, { [Fraction.German]: germanVictims, [Fraction.Partisan]: partisanVictims })
    await sleep(1500)

    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].filter(u => !germanVictims.includes(u.id)),
      [Fraction.Partisan]: prev[Fraction.Partisan].filter(u => !partisanVictims.includes(u.id))
    }))
    setProcessing(false)
  }

  const battleInProgress = armies[Fraction.German].length > 0 && armies[Fraction.Partisan].length > 0

  return (
    <div className={styles.container}>
      <BattleUI
        regionName={region.name}
        germans={armies[Fraction.German].length}
        partisans={armies[Fraction.Partisan].length}
      />

      {[...armies[Fraction.German], ...armies[Fraction.Partisan]].map(u => <Unit key={u.id} {...u} />)}

      {battleInProgress
        ? <Dice className={styles.dice} callback={handleBattleRound} />
        : <BattleReport regionName={region.name} germans={armies[Fraction.German]} partisans={armies[Fraction.Partisan]} />
      }

      <Retreat
        disabled={processing || (phase === GamePhase.ATTACK_PHASE && !liberatedNeighbors.length)}
        region={region}
        onConfirm={target => dispatch({
          type: 'RETREAT',
          regionName: region.name,
          garrison: mapUnitsToTroops(armies[Fraction.German]),
          retreatingTroops: mapUnitsToTroops(armies[Fraction.Partisan]),
          retreatingRegion: target
        })}
      />
    </div>
  )
}

export default Battle