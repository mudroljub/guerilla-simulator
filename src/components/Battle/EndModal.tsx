import shared from '../../assets/styles/shared.module.scss'
import { useStore } from '../../store/store'
import { Fraction, RegionState, Troops } from '../../types/types'
import { UnitProps } from '../Unit/Unit'

interface Props {
    winner: Fraction
    germans: UnitProps[]
    partisans: UnitProps[]
    region: RegionState
}

export default function EndModal({ region, winner, germans, partisans }:Props) {
  const { dispatch } = useStore()

  const handleFinishBattle = () => {
    if (!winner) return
    const survivingArmy = winner === Fraction.German ? germans : partisans
    const survivors: Troops = survivingArmy.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    dispatch({
      type: 'END_BATTLE',
      regionName: region.name,
      winner,
      survivors
    })
  }

  return (
    <div className={shared.blackModal}>
      <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
      <p>{winner === Fraction.Partisan ? 'Another Yugoslav town has been liberated!' : 'Your forces have suffered a heavy blow.'}</p>
      <button onClick={handleFinishBattle} className={shared.button}>Back to map</button>
    </div>
  )
}