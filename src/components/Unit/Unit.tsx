import classNames from 'classnames'
import { useMemo } from 'react'
import { Fraction, IconDict, Position, UnitState, UnitType } from '../../types/types'
import { sample } from '../../utils/math'
import styles from './Unit.module.scss'
import { battleDict } from './data'

export interface UnitProps {
  id: string
  fraction: Fraction
  type: UnitType
  position?: Position
  className?: string
  state?: UnitState
  iconDict?: IconDict
}

export default function Unit({
  fraction,
  type,
  position,
  className,
  state = UnitState.dying,
  iconDict = battleDict,
}: UnitProps) {
  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction]?.[type]
    return icons?.length ? sample(icons) : null
  }, [fraction, iconDict, type])

  const getAnim = () => {
    const isGerman = fraction === Fraction.German
    switch (state) {
      case UnitState.dying:
        return isGerman ? styles.fallingGerman : styles.fallingPartisan
      case UnitState.shooting:
        return isGerman ? styles.shootingGerman : styles.shootingPartisan
      case UnitState.battle:
        return styles.battle
      default:
        return styles.idle
    }
  }

  if (!SvgComponent) return null

  const inlineStyle = position
    ? { top: position.y, left: position.x }
    : undefined

  const animeClass = getAnim()
  console.log(animeClass)

  return (
    <SvgComponent
      className={classNames(styles.unit, animeClass, className)}
      style={inlineStyle}
    />
  )
}