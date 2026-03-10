import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import styles from './BombardmentOverlay.module.scss'

const BombardmentOverlay: React.FC = () => {
  const { state, dispatch } = useStore()
  const { bombardmentEvents, currentBombardmentIndex = 0, regionDict } = state

  const currentEvent = bombardmentEvents?.[currentBombardmentIndex]
  const [showDamage, setShowDamage] = useState(false)

  const isFinished = currentBombardmentIndex === (bombardmentEvents?.length ?? 0)

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ''
    const source = regionDict[currentEvent.sourceId]?.position
    const targets = currentEvent.targets
      .map(t => regionDict[t.regionId]?.position)
      .filter(Boolean) as { x: number, y: number }[]

    return source && targets.length > 0 ? getBombardmentPath(source, targets) : ''
  }, [currentEvent, regionDict])

  useEffect(() => {
    if (!currentEvent || isFinished) return

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
  }, [currentBombardmentIndex, currentEvent, isFinished, dispatch])

  if (isFinished && bombardmentEvents && bombardmentEvents.length > 0)
    return (
      <div className={styles.reportOverlay}>
        <div className={styles.reportBox}>
          <h2>IZVJEŠTAJ O BOMBARDOVANJU</h2>
          <div className={styles.reportList}>
            {bombardmentEvents.map((event, i) => (
              <div key={i} className={styles.reportItem}>
                <strong>{event.sourceId}:</strong>
                {event.targets.map(t => (
                  <div key={t.regionId} className={styles.reportTarget}>
                    {t.isShotDown
                      ? ` 💥 Avion oboren iznad regije ${t.regionId}!`
                      : ` 💣 ${t.regionId} pretrpio -${t.damage} žrtava.`}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            className={styles.continueBtn}
            onClick={() => dispatch({ type: 'NEXT_PHASE' })}
          >
            Zatvori
          </button>
        </div>
      </div>
    )

  if (!currentEvent) return null

  return (
    <div className={styles.container}>
      <svg className={styles.svgLayer}>
        {pathData && <path d={pathData} className={styles.flightPath} />}

        {pathData && (
          <g
            key={`plane-${currentBombardmentIndex}`}
            className={styles.planeWrapper}
            style={{ offsetPath: `path("${pathData}")` }}
          >
            <text x="-15" y="10" fontSize="30">✈️</text>
          </g>
        )}
      </svg>

      {currentEvent.targets.map(t => (
        <div
          key={`${currentBombardmentIndex}-${t.regionId}`}
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