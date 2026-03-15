import { useState } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { useBattleLogic } from '../../hooks/useBattleLogic'
import { useBattleAnimations } from '../../hooks/useBattleAnimations'
import styles from './Battle.module.scss'
import Unit, { UnitProps } from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction, AnimState } from '../../types/types'
import EndModal from './EndModal'
import BattleUI from './BattleUI'
import Retreat from './Retreat'
import { mapUnitsToTroops, sleep } from '../../utils/helpers'

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [battleState, setBattleState] = useState(AnimState.idle)

  const {
    germans, setGermans, partisans, setPartisans,
    calculateHits, getVictims, hasBothSides
  } = useBattleLogic(region)

  const {
    dyingUnits, animateRemoval
  } = useBattleAnimations()

  const handleBattleRound = async(rollValue: number) => {
    // TODO: disabled na Dice, pomeriti tamo uslov
    if (battleState !== AnimState.idle || !hasBothSides) return
    setBattleState(AnimState.shooting)

    await sleep(900)
    setBattleState(AnimState.dying)

    // TODO: refaktor animateRemoval i dyingUnits
    const gVictims = getVictims(germans, calculateHits(partisans, rollValue, Fraction.Partisan))
    const pVictims = getVictims(partisans, calculateHits(germans, rollValue, Fraction.German))
    await Promise.all([
      animateRemoval(gVictims, setGermans),
      animateRemoval(pVictims, setPartisans)
    ])

    setBattleState(AnimState.idle)
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

  const getAnimState = (unit: UnitProps) => {
    if (battleState === AnimState.shooting) return AnimState.shooting
    if (battleState === AnimState.dying && dyingUnits.has(unit.id)) return AnimState.dying
    return AnimState.battle
  }

  return (
    <div className={styles.container}>
      <BattleUI
        regionName={region.name}
        germans={germans.length}
        partisans={partisans.length}
      />

      {[...germans, ...partisans].map(u => (
        <Unit
          key={u.id}
          {...u}
          state={getAnimState(u)}
        />
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
        disabled={battleState !== AnimState.idle || liberatedNeighbors.length === 0}
      />
    </div>
  )
}

export default Battle