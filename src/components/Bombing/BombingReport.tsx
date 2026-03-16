import { useStore } from '../../store/store'
import styles from '../../assets/styles/modal.module.scss'

export default function BombingReport() {
  const { state, dispatch } = useStore()
  const { bombings } = state

  if (!bombings?.length) return null

  return (
    <div className={styles.reportOverlay}>
      <div className={styles.reportBox}>
        <h2>BOMBING_PHASE REPORT</h2>
        <div>
          {bombings.map((event, i) => (
            <div key={i} className={styles.reportItem}>
              <strong>Bombing from {event.bombingFrom}:</strong>
              {event.targets.map(t => (
                <div key={t.regionName} className={styles.reportTarget}>
                  {t.isShotDown
                    ? ` 💥 Aircraft shot down over ${t.regionName}!`
                    : ` 💀 ${t.damage} partisans killed in ${t.regionName} region.`}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          className={styles.continueBtn}
          onClick={() => dispatch({ type: 'NEXT_PHASE' })}
        >
            Close
        </button>
      </div>
    </div>
  )
}