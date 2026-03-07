import classnames from 'classnames'
import { useStore, useIsAttackable } from '../../store/store'
import { Fraction } from '../../types/types'
import styles from './Modal.module.scss'
import AttackOptions from './AttackOptions'
import Units from './Units'

export default function Modal() {
  const { dispatch, state: { selected } } = useStore()
  const attackable = useIsAttackable(selected?.name || '')

  if (!selected) return null

  const { garrison, fraction } = selected
  const attacked = Boolean(selected.attackingForces)

  const getFlag = (fraction: Fraction) => fraction === Fraction.Partisan
    ? <img alt="flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg/330px-Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg.png" className={styles.flag} />
    : <img alt="flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Germany_%281935%E2%80%931945%29.svg/330px-Flag_of_Germany_%281935%E2%80%931945%29.svg.png" className={styles.flag} />

  return (
    <div
      className={styles.modalWrapper}
      onMouseDown={e => e.stopPropagation()}
      onMouseMove={e => e.stopPropagation()}
    >
      <div className={styles.modalBox}>
        <button
          onClick={() => dispatch({ type: 'DESELECT_REGION' })}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2 className={classnames(styles.title, {
          [styles.black]: fraction === Fraction.German
        })}>
          {attacked ? '💥' : getFlag(fraction)}{attacked ? 'Attack on' : ''} {selected.name}
        </h2>

        <Units troops={garrison} fraction={fraction} />

        {
          selected.attackingForces && <Units troops={selected.attackingForces} fraction={Fraction.Partisan} />
        }

        {attackable && <AttackOptions region={selected} />}
      </div>
    </div>
  )
}