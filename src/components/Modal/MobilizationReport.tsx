import { useStore } from '../../store/store'
import styles from './Modal.module.scss'

interface Props {
  onClose: () => void
}

export default function MobilizationReport({ onClose }: Props) {
  const { dispatch, state: { regionDict } } = useStore()

  const regions = Object.values(regionDict)
    .filter(r => r.lastMobilizedCount > 0)
    .sort((a, b) => b.lastMobilizedCount - a.lastMobilizedCount)

  const total = regions.reduce((sum, r) => sum + r.lastMobilizedCount, 0)

  const onClick = () => {
    dispatch({ type: 'NEXT_PHASE' })
    onClose()
  }

  return (
    <div className={styles.reportOverlay} onClick={onClose}>
      <div className={styles.reportBox}>
        <h2>MOBILIZATION REPORT</h2>
        <div className={styles.reportList}>
          {regions.map(region => (
            <div key={region.name} className={styles.reportItem}>
              <strong>Mobilization  </strong>
              <div className={styles.reportTarget}>
                {region.name}: +{region.lastMobilizedCount.toLocaleString()} recruits
              </div>
            </div>
          ))}

          <div className={styles.reportItem}>
            <strong>Total</strong>
            <div className={styles.reportTarget}>
              {total.toLocaleString()} new volunteers joined the resistance
            </div>
          </div>
        </div>

        <button
          className={styles.continueBtn}
          onClick={onClick}
        >
          Continue
        </button>

      </div>
    </div>
  )
}