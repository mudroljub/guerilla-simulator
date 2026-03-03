import Map from './components/Map/Map'
import legend from './assets/images/legenda.webp'
import styles from "./App.module.scss"

function App() {
  return (
    <>
      <Map />
      <img src={legend} alt="legend" className={styles.legend} />
    </>
  )
}

export default App