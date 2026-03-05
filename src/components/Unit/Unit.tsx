import { useMemo } from "react"
import { Fraction, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from "./Unit.module.scss"
import { iconDict } from "./data"

interface Props {
  fraction: Fraction;
  unitType: UnitType;
}

export default function Unit({ fraction, unitType }: Props) {

  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction][unitType]
    if (!icons?.length) return null
    return sample(icons)
  }, [fraction, unitType])

  if (!SvgComponent) return null

  return (
    <div>
      <SvgComponent className={styles.icon} />
    </div>
  )
}