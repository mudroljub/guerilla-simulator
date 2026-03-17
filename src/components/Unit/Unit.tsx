import classNames from 'classnames'
import { useMemo } from 'react'
import { Fraction, IconDict, Position, AnimState, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import { battleDict } from './data'

export interface UnitProps {
  id: string
  fraction: Fraction
  type: UnitType
  position?: Position
  className?: string
  state?: AnimState
  iconDict?: IconDict
}

export default function Unit({
  fraction,
  type,
  position,
  className,
  state = AnimState.battle,
  iconDict = battleDict,
}: UnitProps) {
  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction]?.[type]
    return icons?.length ? sample(icons) : null
  }, [fraction, iconDict, type])

  const getAnimClass = () => {
    const isGerman = fraction === Fraction.German
    switch (state) {
      case AnimState.dying:
        return isGerman ? styles.fallingGerman : styles.fallingPartisan
      case AnimState.shooting:
        return isGerman ? styles.shootingGerman : styles.shootingPartisan
      case AnimState.battle:
        return type === UnitType.tanks ? styles.tank : (isGerman ? styles.battleLeft : styles.battleRight)
      case AnimState.idle:
        return styles.breath
      default:
        return ''
    }
  }

  const idleDelay = useMemo(() => `${Math.random() * 2}s`, [])
  const shootDelay = useMemo(() => `${Math.random() * .4}s`, [])

  if (!SvgComponent) return null

  const style = {
    '--idle-delay': idleDelay,
    '--shoot-delay': shootDelay,
    ...(position && { top: position.y, left: position.x })
  }

  const animeClass = getAnimClass()

  return (
    <SvgComponent
      className={classNames(styles.unit, animeClass, className)}
      style={style}
    />
  )
}