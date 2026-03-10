import { useState, useMemo } from 'react'
import classnames from 'classnames'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import DiceButton from '../Dice/Dice'
import styles from './BombardmentOverlay.module.scss'

const BombardmentOverlay = () => {
  const { state, dispatch } = useStore()
  const { bombardmentEvents, currentBombardmentIndex = 0, regionDict } = state

  const currentEvent = bombardmentEvents ? bombardmentEvents[currentBombardmentIndex] : null

  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [isPlaneFalling, setIsPlaneFalling] = useState(false)

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ''

    const sourceRegion = regionDict[currentEvent.sourceId]
    if (!sourceRegion) return ''

    const source = sourceRegion.position
    const targets = currentEvent.targets
      .map(t => regionDict[t.regionId]?.position)
      .filter(Boolean)

    return getBombardmentPath(source, targets)
  }, [currentEvent, regionDict])

  if (!currentEvent || !bombardmentEvents || bombardmentEvents.length === 0) return null

  const currentTarget = currentEvent.targets[currentTargetIndex]
  const targetRegion = regionDict[currentTarget.regionId]

  const handleRollResult = (result: number) => {
    if (result >= currentTarget.neededRoll) {
      setIsPlaneFalling(true)
      setTimeout(() => {
        dispatch({ type: 'RESOLVE_PLANE_DOWN', sourceId: currentEvent.sourceId })
        setIsPlaneFalling(false)
        setCurrentTargetIndex(0)
      }, 1000)
    } else {
      dispatch({ type: 'RESOLVE_BOMBARD_HIT', targetId: currentTarget.regionId })

      setTimeout(() => {
        if (currentTargetIndex < currentEvent.targets.length - 1)
          setCurrentTargetIndex(prev => prev + 1)
        else {
          setCurrentTargetIndex(0)
          dispatch({ type: 'NEXT_PHASE' })
        }
      }, 500)
    }
  }

  return (
    <div className={styles.overlay}>
      <svg className={styles.svgLayer}>
        <path d={pathData} className={styles.flightPath} />

        <g
          className={classnames(styles.plane, { [styles.falling]: isPlaneFalling })}
          style={{
            offsetPath: `path("${pathData}")`,
            offsetDistance: `${(currentTargetIndex / (currentEvent.targets.length + 1)) * 100}%`
          }}
        >
          <text x="-15" y="10" fontSize="30">✈️</text>
        </g>
      </svg>

      {!isPlaneFalling && targetRegion && (
        <div
          className={styles.interactionPoint}
          style={{
            left: targetRegion.position.x,
            top: targetRegion.position.y
          }}
        >
          <div className={styles.targetLabel}>
            Potrebno: {currentTarget.neededRoll}+
          </div>
          <DiceButton callback={handleRollResult} />
        </div>
      )}
    </div>
  )
}

export default BombardmentOverlay