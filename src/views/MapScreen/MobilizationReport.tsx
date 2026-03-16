import { useStore } from '../../store/store'
import styles from './MobilizationReport.module.scss'

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <header className={styles.header}>
          <h2>Mobilization Report</h2>
          <button onClick={onClose} className={styles.close}>✕</button>
        </header>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Region</th>
              <th>New recruits</th>
            </tr>
          </thead>

          <tbody>
            {regions.map(region => (
              <tr key={region.name}>
                <td>{region.name}</td>
                <td>{region.lastMobilizedCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Total</td>
              <td>{total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <button
          className={styles.continueBtn}
          onClick={onClick}
        >
            Close
        </button>
      </div>
    </div>
  )
}