import classnames from 'classnames'
import { useMemo } from 'react'
import { Fraction, Position, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import { iconDict } from './data'

interface Props {
  fraction: Fraction;
  unitType: UnitType;
  position?: Position;
  className?: string;
  isDying?: boolean;
}

export default function Unit({ fraction, unitType, position, className, isDying }: Props) {

  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction][unitType]
    if (!icons?.length) return null
    return sample(icons)
  }, [fraction, unitType])

  const dyingClass = useMemo(() => {
    if (!isDying) return ''
    return fraction === Fraction.German ? styles.fallingGerman : styles.fallingPartisan
  }, [isDying, fraction])

  if (!SvgComponent) return null

  return (
    <SvgComponent
      className={classnames(className, styles.unit, dyingClass)}
      style={position ? { top: position.y, left: position.x } : undefined}
    />
  )
}