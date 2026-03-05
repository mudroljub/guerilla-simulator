import { useMemo } from "react"
import { CITY_LABEL_THRESHOLD } from '../../config'
import { Fraction, Troops, RegionState, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from "./Unit.module.scss"
import Unit from './Unit'

function getRandomUnitType(garrison: Troops): UnitType {
  const units = (Object.keys(garrison) as UnitType[])
    .filter(unitType => (garrison[unitType] ?? 0) > 0)
  return Math.random() > 0.33 ? sample(units) : UnitType.infantry
}

interface Props {
  region: RegionState;
}

export default function UnitIcon({ region }: Props) {
  const { fraction, garrison } = region

  const unitType = useMemo<UnitType>(() => {
    return fraction === Fraction.German ? getRandomUnitType(garrison) : UnitType.infantry
  }, [fraction, garrison])

  if ((fraction === Fraction.German  && region.size <= CITY_LABEL_THRESHOLD * 1.5)) return null

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}>
      <Unit className={styles.icon} fraction={fraction} unitType={unitType} />
    </g>
  )
}