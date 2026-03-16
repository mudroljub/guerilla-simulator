import { useMemo } from 'react'
import styles from '../../assets/styles/modal.module.scss'
import { useStore } from '../../store/store'
import { Fraction } from '../../types/types'
import { mapUnitsToTroops } from '../../utils/helpers'
import { UnitProps } from '../Unit/Unit'
import defeatImg from '../../assets/images/pozadina-dimi.gif'
import victoryImg from '../../assets/images/art/Đorđe_Andrejević_Kun_-_Kolona,_ulje.jpg'

const DIARY_MESSAGES = {
  VICTORY: [
    'The National Liberation Army has entered the settlement. The population celebrates their freedom!',
    'The enemy has retreated in disarray. Significant quantities of equipment have been captured.',
    'Another occupier stronghold has fallen. The road to total liberation is open!'
  ],
  DEFEAT: [
    'Our units were forced to withdraw in the face of superior enemy numbers.',
    'Heavy losses sustained. Supreme Command orders immediate regrouping.',
    'A temporary setback. The spirit of resistance remains unbroken despite the casualties.'
  ]
}

interface Props {
  germans: UnitProps[]
  partisans: UnitProps[]
  regionName: string
}

export default function BattleReport({ regionName, germans, partisans }: Props) {
  const { dispatch } = useStore()

  const isVictory = germans.length === 0 && partisans.length > 0
  const isDefeat = partisans.length === 0 && germans.length > 0
  const winner = isVictory ? Fraction.Partisan : isDefeat ? Fraction.German : null

  const diaryEntry = useMemo(() => {
    const list = isVictory ? DIARY_MESSAGES.VICTORY : DIARY_MESSAGES.DEFEAT
    return list[Math.floor(Math.random() * list.length)]
  }, [isVictory])

  const endBattle = () => {
    if (!winner) return
    const survivingUnits = winner === Fraction.German ? germans : partisans
    const survivors = mapUnitsToTroops(survivingUnits)

    dispatch({
      type: 'END_BATTLE',
      regionName,
      winner,
      survivors
    })
  }

  return (
    <div className={styles.reportOverlay}>
      <div className={styles.reportBox}>
        <h2>{isVictory ? 'VICTORY' : 'DEFEAT'}</h2>
        <img src={isVictory ? victoryImg : defeatImg} alt="" />

        <p className={styles.reportTarget}>"{diaryEntry}"</p>

        <div>
          <p>Location: <strong>{regionName}</strong></p>
          {winner === Fraction.Partisan ? (
            <p>Liberated by: <strong>{partisans.length} partisans</strong></p>
          ) : (
            <p>Occupied by: <strong>{germans.length} germans</strong></p>
          )}
        </div>

        <button onClick={endBattle} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  )
}