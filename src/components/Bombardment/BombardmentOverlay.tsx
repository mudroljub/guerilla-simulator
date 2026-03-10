import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import styles from './BombardmentOverlay.module.scss'

const BombardmentOverlay: React.FC = () => {
  const { state, dispatch } = useStore()
  const { bombardmentEvents, currentBombardmentIndex = 0, regionDict } = state

  const currentEvent = bombardmentEvents?.[currentBombardmentIndex]
  const [showDamage, setShowDamage] = useState(false)

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ""
    const source = regionDict[currentEvent.sourceId]?.position
    const targets = currentEvent.targets
      .map(t => regionDict[t.regionId]?.position)
      .filter(Boolean) as {x: number, y: number}[]

    return source && targets.length > 0 ? getBombardmentPath(source, targets) : ""
  }, [currentEvent, regionDict])

  useEffect(() => {
    if (!currentEvent) return

    setShowDamage(false)

    const damageTimer = setTimeout(() => setShowDamage(true), 1000)

    const endTimer = setTimeout(() => {
      dispatch({ type: 'APPLY_BOMBARDMENT_RESULTS', eventIndex: currentBombardmentIndex })
      dispatch({ type: 'NEXT_PHASE' })
    }, 2000)

    return () => {
      clearTimeout(damageTimer)
      clearTimeout(endTimer)
    }
  }, [currentBombardmentIndex, currentEvent, dispatch])

  if (!currentEvent) return null

  return (
    <div className={styles.container}>
      <svg className={styles.svgLayer}>
        <path d={pathData} className={styles.flightPath} />
        <g className={styles.planeWrapper} style={{ offsetPath: `path("${pathData}")` }}>
          <text x="-15" y="10" fontSize="30">✈️</text>
        </g>
      </svg>

      {currentEvent.targets.map((t) => (
        <div
          key={t.regionId}
          className={`${styles.resultPopup} ${showDamage ? styles.visible : ''}`}
          style={{
            left: `${regionDict[t.regionId].position.x}px`,
            top: `${regionDict[t.regionId].position.y}px`
          }}
        >
          {t.isShotDown ? (
            <span className={styles.shotDown}>💥 OBOREN!</span>
          ) : (
            <span className={styles.damage}>-{t.damage} 🎖️</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default BombardmentOverlay