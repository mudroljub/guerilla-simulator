import classnames from "classnames"
import { useMemo } from "react"
import { Fraction, Position, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from "./Unit.module.scss"
import { iconDict } from "./data"

interface Props {
  fraction: Fraction;
  unitType: UnitType;
  position?: Position;
  className?: string;
}

export default function Unit({ fraction, unitType, position, className }: Props) {

  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction][unitType]
    if (!icons?.length) return null
    return sample(icons)
  }, [fraction, unitType])

  if (!SvgComponent) return null

  return (
    <SvgComponent 
      className={classnames(className, styles.unit)} 
      style={position ? { top: position.y, left: position.x } : undefined} 
    />
  )
}