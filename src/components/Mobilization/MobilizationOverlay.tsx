import React from 'react'
import { Fraction } from '../../types/types'
import styles from './MobilizationOverlay.module.scss'
import { useStore } from '../../store/store'

const MobilizationOverlay: React.FC = () => {
  const { state: { regionDict } } = useStore()

  const renderMobilizationNumbers = () =>
    Object.values(regionDict)
      .filter(region => region.fraction === Fraction.Partisan && region.lastMobilizedCount > 0)
      .map(region => (
        <div
          key={region.name}
          className={styles.floatingNumber}
          style={{
            left: `${region.position.x}px`,
            top: `${region.position.y}px`,
          }}
        >
          +{region.lastMobilizedCount.toLocaleString()}
        </div>
      ))

  return (
    <div className={styles.container}>
      {renderMobilizationNumbers()}
    </div>
  )
}

export default MobilizationOverlay