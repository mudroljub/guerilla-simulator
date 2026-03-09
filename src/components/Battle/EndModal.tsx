import { useMemo } from 'react'
import shared from '../../assets/styles/shared.module.scss'
import { useStore } from '../../store/store'
import { Fraction } from '../../types/types'
import { mapUnitsToTroops } from '../../utils/helpers'
import { UnitProps } from '../Unit/Unit'

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

export default function EndModal({ regionName, germans, partisans }: Props) {
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
    <div className={shared.blackModal}>
      <div className={shared.diaryPaper}>
        <small>OFFICIAL DISPATCH</small>
        <h2>{isVictory ? 'VICTORY' : 'DEFEAT'}</h2>

        <p className={shared.diaryText}>"{diaryEntry}"</p>

        <div className={shared.battleSummary}>
          <p>Location: <strong>{regionName}</strong></p>
          {winner === Fraction.Partisan ? (
            <p>Liberated by: <strong>{partisans.length} partisans</strong></p>
          ) : (
            <p>Occupied by: <strong>{germans.length} germans</strong></p>
          )}
        </div>

        <button onClick={endBattle} className={shared.button}>
          Continue War
        </button>
      </div>
    </div>
  )
}