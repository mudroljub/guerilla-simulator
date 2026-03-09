import shared from '../../assets/styles/shared.module.scss'
import { useStore } from '../../store/store'
import { Fraction, Troops } from '../../types/types'
import { UnitProps } from '../Unit/Unit'

interface Props {
    germans: UnitProps[]
    partisans: UnitProps[]
    regionName: string
}

export default function EndModal({ regionName, germans, partisans }:Props) {
  const { dispatch } = useStore()

  const winner = germans.length === 0 && partisans.length > 0
    ? Fraction.Partisan
    : partisans.length === 0 && germans.length > 0
      ? Fraction.German
      : null

  const endBattle = () => {
    if (!winner) return null

    const survivingArmy = germans.length > 0 ? germans : partisans
    const survivors: Troops = survivingArmy.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1
      return acc
    }, {} as Troops)

    dispatch({
      type: 'END_BATTLE',
      regionName,
      winner,
      survivors
    })
  }

  return (
    <div className={shared.blackModal}>
      <h2>{winner === Fraction.Partisan ? 'VICTORY' : 'DEFEAT'}</h2>
      <p>{winner === Fraction.Partisan ? 'Another Yugoslav town has been liberated!' : 'Your forces have suffered a heavy blow.'}</p>
      <button onClick={endBattle} className={shared.button}>Back to map</button>
    </div>
  )
}