import classnames from 'classnames'
import { useMemo } from 'react'
import { Fraction, IconDict, Position, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import { battleDict } from './data'

export interface UnitProps {
  key: string
  fraction: Fraction
  type: UnitType
  position?: Position
  className?: string
  isDying?: boolean
  isShooting?: boolean
  iconDict?: IconDict
}

export default function Unit({ fraction, type, position, className, isDying, isShooting, iconDict = battleDict }: UnitProps) {

  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction][type]
    if (!icons?.length) return null
    return sample(icons)
  }, [fraction, iconDict, type])

  const dyingClass = useMemo(() => {
    if (!isDying) return ''
    return fraction === Fraction.German ? styles.fallingGerman : styles.fallingPartisan
  }, [isDying, fraction])

  const shootingClass = useMemo(() => {
    if (!isShooting) return ''
    return fraction === Fraction.German ? styles.shootingGerman : styles.shootingPartisan
  }, [isShooting, fraction])

  if (!SvgComponent) return null

  return (
    <SvgComponent
      className={classnames(className, styles.unit, dyingClass, shootingClass)}
      style={position ? { top: position.y, left: position.x } : undefined}
    />
  )
}