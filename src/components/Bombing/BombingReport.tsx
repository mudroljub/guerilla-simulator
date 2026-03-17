import { useStore } from '../../store/store'
import styles from '../../assets/styles/modal.module.scss'
import imgSrc from '../../assets/images/pozadina-dimi.gif'
import shared from '../../assets/styles/shared.module.scss'

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

  const onClick = () => dispatch({ type: 'NEXT_PHASE' })

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBody}>
        <button onClick={onClick} className={styles.closeButton}>
          ×
        </button>
        <h2>BOMBARDMENT REPORT</h2>
        <img src={imgSrc} alt="" />
        <p>
          Summary: {totalPartisans} partisans killed, {totalPlanes} aircraft shot down.
        </p>
        <div>
          {bombings.map((event, i) => (
            <div key={i} className={styles.reportItem}>
              <strong>Bombing from {event.bombingFrom} base:</strong>
              {event.targets.map(t => (
                <div key={t.regionName}>
                  {t.isShotDown
                    ? ` 💥 Aircraft shot down over ${t.regionName}!`
                    : ` 💀 ${t.damage} partisans killed in ${t.regionName} region.`}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          className={shared.button}
          onClick={onClick}
        >
            Close
        </button>
      </div>
    </div>
  )
}