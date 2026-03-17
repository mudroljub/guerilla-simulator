import { useMemo } from 'react'
import styles from '../../assets/styles/modal.module.scss'
import { useStore } from '../../store/store'
import { Fraction } from '../../types/types'
import { mapUnitsToTroops } from '../../utils/helpers'
import { UnitProps } from '../Unit/Unit'
import defeatImg from '../../assets/images/art/Vojo_Dimitrijević_-_Tifusar.jpg'
import victoryImg from '../../assets/images/art/Đorđe_Andrejević_Kun_-_Kolona,_ulje.jpg'

const DIARY_MESSAGES = {
  VICTORY: [
    'The People\'s Liberation Army has entered the settlement. The population is joining the partisans!',
    'The enemy has retreated in disarray. Significant quantities of equipment have been captured.',
    'Another occupier stronghold has fallen. The road to liberation is open!'
  ],
  DEFEAT: [
    'Our units suffered a heavy defeat. The battle is lost but the war continues.',
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

  const description = useMemo(() => {
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

  const victoryTitle = `Liberation of ${regionName}`
  const defeatTitle = `Defeat at ${regionName}`

  return (
    <div className={styles.reportOverlay}>
      <div className={styles.reportBox}>
        <h2>{isVictory ? victoryTitle : defeatTitle}</h2>

        <img src={isVictory ? victoryImg : defeatImg} alt="" />

        <p className={styles.reportTarget}>{description}</p>

        {winner === Fraction.Partisan ? (
          <b>{regionName} is being liberated by {partisans.length} partisans.</b>
        ) : (
          <b>{regionName} remains occupied by {germans.length} Germans.</b>
        )}

        <button onClick={endBattle} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  )
}