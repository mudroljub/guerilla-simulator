import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/store'
import { getBombardmentPath } from '../../utils/math'
import styles from './BombardmentOverlay.module.scss'
import BombingReport from '../Modal/BombingReport'
import imgSrc from '../../assets/images/german/aircraft/avion-odozgo-01.png'

const IMG_SIZE = 64

const BombardmentOverlay = () => {
  const { state, dispatch } = useStore()
  const { bombings, currentBombardmentIndex = 0, regionDict } = state
  const [showDamage, setShowDamage] = useState(false)

  const currentEvent = bombings[currentBombardmentIndex]
  const isFinished = currentBombardmentIndex === bombings.length

  const isPlaneShotDown = currentEvent?.targets.some(t => t.isShotDown)

  const pathData = useMemo(() => {
    if (!currentEvent || !regionDict) return ''
    const source = regionDict[currentEvent.bombingFrom].position
    const targets = currentEvent.targets.map(t => regionDict[t.regionName].position)

    return (source && targets.length > 0) ? getBombardmentPath(source, targets) : ''
  }, [currentEvent, regionDict])

  useEffect(() => {
    if (!currentEvent || isFinished) return

    setShowDamage(false)

    const damageTimer = setTimeout(() => setShowDamage(true), 1000)
    const endTimer = setTimeout(() => {
      dispatch({ type: 'APPLY_BOMBARDMENT_RESULTS', eventIndex: currentBombardmentIndex })
      dispatch({ type: 'NEXT_PHASE' })
    }, 2500) // css animation length

    return () => {
      clearTimeout(damageTimer)
      clearTimeout(endTimer)
    }
  }, [currentBombardmentIndex, currentEvent, isFinished, dispatch])

  if (isFinished) return <BombingReport />
  if (!currentEvent) return null

  return (
    <div className={styles.container}>

      {pathData && !(showDamage && isPlaneShotDown) && (
        <div
          key={`plane-${currentBombardmentIndex}`}
          className={styles.planeWrapper}
          style={{ offsetPath: `path("${pathData}")` }}
        >
          <img src={imgSrc} width={IMG_SIZE} height={IMG_SIZE} alt="" />
        </div>
      )}

      {currentEvent.targets.map(target => (
        <div
          key={`${currentBombardmentIndex}-${target.regionName}`}
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

export default BombardmentOverlay