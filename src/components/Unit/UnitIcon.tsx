import { useMemo } from 'react'
import { Fraction, Troops, RegionState, UnitType, IconDict } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import Unit from './Unit'

function getRandomUnitType(garrison: Troops): UnitType {
  const units = (Object.keys(garrison) as UnitType[])
    .filter(type => (garrison[type] ?? 0) > 0)
  return Math.random() > 0.33 ? sample(units) : UnitType.infantry
}

interface Props {
  id: string,
  region: RegionState;
  iconDict?: IconDict
}

export default function UnitIcon({ region, id, iconDict }: Props) {
  const { fraction, garrison } = region

  const type = useMemo<UnitType>(() => fraction === Fraction.German ? getRandomUnitType(garrison) : UnitType.infantry, [fraction, garrison])

  if (fraction === Fraction.German) return null //  && region.size <= CITY_LABEL_THRESHOLD * 1.5

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}>
      <Unit className={styles.icon} fraction={fraction} type={type} id={id} iconDict={iconDict} />
    </g>
  )
}