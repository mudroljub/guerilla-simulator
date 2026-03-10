import React, { useState, useMemo, useEffect } from 'react'
import classnames from 'classnames'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import DiceButton from '../Dice/Dice'
import styles from './BombardmentOverlay.module.scss'

const BombardmentOverlay: React.FC = () => {
  const { state, dispatch } = useStore()
  const { bombardmentEvents, currentBombardmentIndex = 0, regionDict } = state

  const currentEvent = bombardmentEvents ? bombardmentEvents[currentBombardmentIndex] : null
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [isPlaneFalling, setIsPlaneFalling] = useState(false)

  useEffect(() => {
    setCurrentTargetIndex(0)
    setIsPlaneFalling(false)
  }, [currentBombardmentIndex])

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ''
    const source = regionDict[currentEvent.sourceId]?.position
    const targets = currentEvent.targets
      .map(t => regionDict[t.regionId]?.position)
      .filter(Boolean) as {x: number, y: number}[]

    if (!source || targets.length === 0) return ''
    return getBombardmentPath(source, targets)
  }, [currentEvent, regionDict])

  if (!currentEvent || !regionDict) return null

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
    <div className={styles.container}>
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
            left: `${targetRegion.position.x}px`,
            top: `${targetRegion.position.y}px`
          }}
        >
          <div className={styles.targetLabel}>
            {currentTarget.neededRoll}+
          </div>
          <DiceButton callback={handleRollResult} />
        </div>
      )}
    </div>
  )
}

export default BombardmentOverlay