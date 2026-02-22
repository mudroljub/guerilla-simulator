import { Properties } from 'csstype';
import gradovi from '../../data/gradovi_normalizovano.json'
import styles from './Main.module.scss'

const html = Object.entries(gradovi).map(([naziv, grad]) => {
  const style: Properties  = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)', 
    top: `${grad.pozicija.y * 100}%`,
    left: `${grad.pozicija.x * 100}%`,
  }
  return (
    <div style={style}>
      <br/>{naziv}
    </div>
  )
})

export default function Main() {
  return (
    <div className={styles.map}>
      {html}
    </div>
  )
}