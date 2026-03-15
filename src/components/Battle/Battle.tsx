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

  const setAnim = (anim: AnimState, victims: Record<Fraction, string[]> = { [Fraction.German]: [], [Fraction.Partisan]: [] }) => {
    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].map(u => ({ ...u, state: victims[Fraction.German].includes(u.id) ? AnimState.dying : anim })),
      [Fraction.Partisan]: prev[Fraction.Partisan].map(u => ({ ...u, state: victims[Fraction.Partisan].includes(u.id) ? AnimState.dying : anim }))
    }))
  }

  const calculateHits = (attacker: UnitProps[], rollValue: number, fraction: Fraction) => {
    const normRoll = (rollValue - 1) / 5
    const mod = fraction === Fraction.Partisan ? normRoll * 0.01 - 0.005 : 0.005 - normRoll * 0.01

    return attacker.reduce((total, u) => {
      let hit = roll() <= UNIT_STRENGTH[u.type]
      if (Math.random() < Math.abs(mod)) hit = !hit
      return hit ? total + 1 : total
    }, 0)
  }

  const getVictims = (units: UnitProps[], hits: number) => {
    const victimIds: string[] = []
    let h = hits
    for (const u of units)
      if (h >= UNIT_STRENGTH[u.type]) {
        h -= UNIT_STRENGTH[u.type]
        victimIds.push(u.id)
      }
    return victimIds
  }

  const handleBattleRound = async(rollValue: number) => {
    if (processing || armies[Fraction.German].length === 0 || armies[Fraction.Partisan].length === 0) return
    setProcessing(true)

    setAnim(AnimState.shooting)
    await sleep(900)

    const germansDead = getVictims(armies[Fraction.German], calculateHits(armies[Fraction.Partisan], rollValue, Fraction.Partisan))
    const partisansDead = getVictims(armies[Fraction.Partisan], calculateHits(armies[Fraction.German], rollValue, Fraction.German))

    setAnim(AnimState.battle, { [Fraction.German]: germansDead, [Fraction.Partisan]: partisansDead })
    await sleep(1500)

    setArmies(prev => ({
      [Fraction.German]: prev[Fraction.German].filter(u => !germansDead.includes(u.id)),
      [Fraction.Partisan]: prev[Fraction.Partisan].filter(u => !partisansDead.includes(u.id))
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

      {[...armies[Fraction.German], ...armies[Fraction.Partisan]].map(u => (
        <Unit key={u.id} {...u} />
      ))}

      {hasBothSides ? (
        <Dice className={styles.dice} callback={handleBattleRound} />
      ) : (
        <EndModal
          regionName={region.name}
          germans={armies[Fraction.German]}
          partisans={armies[Fraction.Partisan]}
        />
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
        disabled={processing || liberatedNeighbors.length === 0}
      />
    </div>
  )
}

export default Battle