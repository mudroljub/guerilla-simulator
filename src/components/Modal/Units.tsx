import { Fraction, Troops } from '../../types/types'
import styles from './Modal.module.scss'

interface Props {
  troops: Troops;
  fraction: Fraction;
}

export default function Units({ troops, fraction }: Props) {

  return (
    <div>
      <p className={styles.text}>
        <strong>{fraction}s:</strong>
      </p>
      <ul className={styles.text}>
        <li><img alt="icon" className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Civil_Military_Coordination_-_The_Noun_Project.svg" /> {troops.infantry} infantry</li>
        {troops?.artillery! > 0 && <li><img alt="icon" className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/6/64/Maki1-historic-15.svg" /> {troops.artillery} artillery</li>}
        {troops?.tanks! > 0 && <li><img alt="icon" className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/f/ff/CH-Zusatztafel-Panzer.svg" /> {troops.tanks} armor</li>}
        {troops?.aircraft! > 0 && <li><img alt="icon" className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/1/19/Black_aircraft_icon.svg" /> {troops.aircraft} aircraft</li>}
      </ul>
    </div>
  )
}