import { useState } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { useBattleLogic } from '../../hooks/useBattleLogic'
import styles from './Battle.module.scss'
import Unit from '../Unit/Unit'
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

  const [processing, setProcessing] = useState(false)

  const {
    germans, setGermans, partisans, setPartisans,
    calculateHits, getVictims, hasBothSides
  } = useBattleLogic(region)

  const handleBattleRound = async(rollValue: number) => {
    if (processing || !hasBothSides) return
    setProcessing(true)

    setGermans(prev => prev.map(unit => ({ ...unit, state: AnimState.shooting })))
    setPartisans(prev => prev.map(unit => ({ ...unit, state: AnimState.shooting })))
    await sleep(900)

    const gVictims = getVictims(germans, calculateHits(partisans, rollValue, Fraction.Partisan))
    const pVictims = getVictims(partisans, calculateHits(germans, rollValue, Fraction.German))

    setGermans(prev => prev.map(u => ({ ...u, state: gVictims.includes(u.id) ? AnimState.dying : AnimState.battle })))
    setPartisans(prev => prev.map(u => ({ ...u, state: pVictims.includes(u.id) ? AnimState.dying : AnimState.battle })))
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

  console.log(germans)

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
        disabled={processing || liberatedNeighbors.length === 0}
      />
    </div>
  )
}

export default Battle