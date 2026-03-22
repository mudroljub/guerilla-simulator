import { useMemo } from 'react'
import { Fraction, RegionState, UnitType, AnimState } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import Unit from './Unit'
import { useStore } from '../../store/store'
import { mapDict } from '../Unit/data'

interface Props {
  id: string,
  region: RegionState;
}

export default function UnitIcon({ region, id }: Props) {
  const { fraction } = region
  const { state: { offensives } } = useStore()

  const type = useMemo<UnitType>(() => fraction === Fraction.German
    ? sample([UnitType.tanks, UnitType.artillery])
    : UnitType.infantry, [fraction])

  if (fraction === Fraction.German && !offensives.includes(region.name)) return null

  const offsetX = fraction === Fraction.German ? 90 : 20

  return (
    <g transform={`translate(${region.position.x - offsetX}, ${region.position.y - 30})`}>
      <Unit className={styles.icon} fraction={fraction} type={type} id={id} iconDict={mapDict} state={AnimState.idle} />
    </g>
  )
}