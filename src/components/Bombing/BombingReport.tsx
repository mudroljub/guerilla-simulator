import { useStore } from '../../store/store'
import styles from '../../assets/styles/modal.module.scss'
import imgSrc from '../../assets/images/pozadina-dimi.gif'

export default function BombingReport() {
  const { state, dispatch } = useStore()
  const { bombings } = state

  if (!bombings?.length) return null

  const totalPartisans = bombings.reduce(
    (sum, event) => sum + event.targets.reduce((s, t) => s + (t.isShotDown ? 0 : t.damage), 0),
    0
  )
  const totalPlanes = bombings.reduce(
    (sum, event) => sum + event.targets.filter(t => t.isShotDown).length,
    0
  )

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBody}>
        <h2>BOMBARDMENT REPORT</h2>
        <img src={imgSrc} alt="" />
        <p className={styles.reportTarget}>
          Summary: {totalPartisans} partisans killed, {totalPlanes} aircraft shot down.
        </p>
        <div>
          {bombings.map((event, i) => (
            <div key={i} className={styles.reportItem}>
              <strong>Bombing from {event.bombingFrom} base:</strong>
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