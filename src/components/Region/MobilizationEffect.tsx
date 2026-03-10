import React from 'react'
import { RegionState, Fraction } from '../../types/types'
import styles from './MobilizationEffect.module.scss'

interface MobilizationOverlayProps {
  regionDict: Record<string, RegionState>
}

export const MobilizationOverlay: React.FC<MobilizationOverlayProps> = ({ regionDict }) => (
  <div className={styles.container}>
    {Object.values(regionDict).map(region => {
      const hasNewRecruits = region.lastMobilizedCount && region.lastMobilizedCount > 0

      if (region.fraction !== Fraction.Partisan || !hasNewRecruits)
        return null

      return (
        <div
          key={`${region.name}-mob-anim`}
          className={styles.floatingNumber}
          style={{
            left: `${region.position.x}px`,
            top: `${region.position.y}px`,
          }}
        >
            +{region.lastMobilizedCount?.toLocaleString()}
        </div>
      )
    })}
  </div>
)