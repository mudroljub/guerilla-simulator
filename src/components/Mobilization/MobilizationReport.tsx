import { useStore } from '../../store/store'
import styles from '../../assets/styles/modal.module.scss'
import imgSrc from '../../assets/images/art/Ismet_Mujezinović_–_Ustanak.jpg'
import shared from '../../assets/styles/shared.module.scss'

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
    <div className={styles.overlay}>
      <div className={styles.modalBody}>
        <button onClick={onClick} className={styles.closeButton}>
          ×
        </button>

        <h2>MOBILIZATION REPORT</h2>
        <img src={imgSrc} alt="" />
        <p>
          {total.toLocaleString()} new volunteers joined the partisans
        </p>
        <div>
          {regions.map(region => (
            <div key={region.name} className={styles.reportItem}>
              <strong>region  </strong>
              <div>
                {region.name}: +{region.lastMobilizedCount.toLocaleString()} recruits
              </div>
            </div>
          ))}
        </div>

        <button
          className={shared.button}
          onClick={onClick}
        >
          Continue
        </button>

      </div>
    </div>
  )
}