import Map from './components/Map/Map'
import legend from './assets/images/legenda.webp'
import styles from "./App.module.scss"

function App() {
  return (
    <>
      <Map />
      <img className={styles.legend} src={legend} alt="legend" />
      <button className={styles.button}>End turn</button>
    </>
  )
}

export default App