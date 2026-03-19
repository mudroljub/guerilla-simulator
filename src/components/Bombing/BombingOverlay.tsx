import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import styles from './BombingOverlay.module.scss'
import imgSrc from '../../assets/images/german/aircraft/avion-odozgo-01.png'

const IMG_SIZE = 72

const BombingOverlay = () => {
  const { state, dispatch } = useStore()
  const { bombings, bombingIndex = 0, regionDict } = state
  const [showDamage, setShowDamage] = useState(false)

  const currentEvent = bombings[bombingIndex]
  const isPlaneShotDown = currentEvent?.targets.some(t => t.isShotDown)

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ''
    const source = regionDict[currentEvent.bombingFrom].position
    const targets = currentEvent.targets.map(t => regionDict[t.regionName].position)

    return (source && targets.length > 0)
      ? getBombardmentPath(source, targets)
      : ''
  }, [currentEvent, regionDict])

  useEffect(() => {
    if (!currentEvent) return

    setShowDamage(false)

    const damageTimer = setTimeout(() => setShowDamage(true), 1000)
    const endTimer = setTimeout(() => {
      dispatch({ type: 'APPLY_BOMBING_RESULTS', eventIndex: bombingIndex })
      dispatch({ type: 'NEXT_PHASE' })
    }, 2500)

    return () => {
      clearTimeout(damageTimer)
      clearTimeout(endTimer)
    }
  }, [bombingIndex, currentEvent, dispatch])

  if (!currentEvent) return null

  return (
    <div className={styles.container}>

      {pathData && !(showDamage && isPlaneShotDown) && (
        <div
          key={`plane-${bombingIndex}`}
          className={styles.planeWrapper}
          style={{ offsetPath: `path("${pathData}")` }}
        >
          <img src={imgSrc} width={IMG_SIZE} height={IMG_SIZE} alt="" />
        </div>
      )}

      {currentEvent.targets.map(target => (
        <div
          key={`${bombingIndex}-${target.regionName}`}
          className={`${styles.resultPopup} ${showDamage ? styles.visible : ''}`}
          style={{
            left: `${regionDict[target.regionName].position.x}px`,
            top: `${regionDict[target.regionName].position.y}px`
          }}
        >
          {target.isShotDown ? (
            <span className={styles.shotDown}>💥 SHOT DOWN!</span>
          ) : (
            <span className={styles.damage}>-{target.damage} 💀</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default BombingOverlay