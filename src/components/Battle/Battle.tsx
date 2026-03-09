import { useState } from 'react'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { useBattleLogic } from '../../hooks/useBattleLogic'
import { useBattleAnimations } from '../../hooks/useBattleAnimations'
import styles from './Battle.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Unit from '../Unit/Unit'
import Dice from '../Dice/Dice'
import { Fraction } from '../../types/types'
import EndModal from './EndModal'
import BattleUI from './BattleUI'
import { mapUnitsToTroops } from '../../utils/helpers'

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [isAnimating, setIsAnimating] = useState(false)

  const {
    germans,
    setGermans,
    partisans,
    setPartisans,
    calculateHits,
    getVictims,
    hasBothSides
  } = useBattleLogic(region)

  const {
    dyingUnits,
    shootingUnits,
    animateRemoval,
    triggerShooting
  } = useBattleAnimations()

  const handleBattleRound = async(rollValue: number) => {
    if (!hasBothSides || isAnimating) return

    setIsAnimating(true)

    const pHits = calculateHits(partisans, rollValue, Fraction.Partisan)
    const gHits = calculateHits(germans, rollValue, Fraction.German)

    const gVictims = getVictims(germans, pHits)
    const pVictims = getVictims(partisans, gHits)

    triggerShooting([...germans, ...partisans])

    await Promise.all([
      animateRemoval(gVictims, setGermans),
      animateRemoval(pVictims, setPartisans)
    ])

    setIsAnimating(false)
  }

  const retreat = () => {
    const garrison = mapUnitsToTroops(germans)
    const retreatingTroops = mapUnitsToTroops(partisans)

    dispatch({
      type: 'RETREAT',
      regionName: region.name,
      garrison,
      retreatingTroops,
      retreatingRegion: liberatedNeighbors[0],
    })
  }

  return (
    <div className={styles.container}>
      <BattleUI regionName={region.name} germans={germans.length} partisans={partisans.length} />

      {[...germans, ...partisans].map(u => (
        <Unit
          key={u.id}
          {...u}
          isDying={dyingUnits.has(u.id)}
          isShooting={shootingUnits.has(u.id)}
        />
      ))}

      {hasBothSides && (
        <Dice className={styles.dice} callback={handleBattleRound} />
      )}

      {!hasBothSides && (
        <EndModal regionName={region.name} germans={germans} partisans={partisans} />
      )}

      <button className={shared.roundButton} onClick={retreat}>
        Retreat
      </button>
    </div>
  )
}

export default Battle