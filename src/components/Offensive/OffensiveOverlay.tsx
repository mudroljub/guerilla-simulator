import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/store'
import styles from './OffensiveOverlay.module.scss'
import unitImg from '../../assets/images/german/tanks/panzer1a-02.svg'

const OffensiveOverlay = () => {
  const { state, dispatch } = useStore()
  const { offensiveAttacks, offensiveAnimationIndex = 0, regionDict } = state
  const [isMoving, setIsMoving] = useState(false)

  const currentAttack = offensiveAttacks[offensiveAnimationIndex]

  const pathData = useMemo(() => {
    if (!currentAttack || !regionDict) return ''
    const start = regionDict[currentAttack.attackingRegion].position
    const end = regionDict[currentAttack.targetRegion].position

    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
  }, [currentAttack, regionDict])

  useEffect(() => {
    if (!currentAttack) return

    setIsMoving(true)

    const timer = setTimeout(() => {
      setIsMoving(false)
      dispatch({ type: 'APPLY_OFFENSIVE_RESULTS', eventIndex: offensiveAnimationIndex })
      dispatch({ type: 'NEXT_PHASE' })
    }, 1500)

    return () => clearTimeout(timer)
  }, [offensiveAnimationIndex, currentAttack, dispatch])

  if (!currentAttack) return null

  return (
    <div className={styles.container}>
      {isMoving && (
        <div
          className={styles.unitWrapper}
          style={{ offsetPath: `path("${pathData}")` }}
        >
          <img src={unitImg} alt="offensive" />
          <div className={styles.troopCount}>
            {Object.values(currentAttack.offensiveTroops).reduce((a, b) => (a || 0) + (b || 0), 0)}
          </div>
        </div>
      )}

      <div
        className={styles.targetPulse}
        style={{
          left: regionDict[currentAttack.targetRegion].position.x,
          top: regionDict[currentAttack.targetRegion].position.y
        }}
      />
    </div>
  )
}

export default OffensiveOverlay