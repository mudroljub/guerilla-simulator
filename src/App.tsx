import Map from './components/Map/Map'
import legend from './assets/images/legenda.webp'
import styles from "./App.module.scss"
import { BattleLogic } from './components/BattleLogic'
import { useStore } from './store/store'

function App() {
  const { dispatch } = useStore()

  const onClick = () => dispatch({ type: 'START_BATTLE_PHASE' })

  return (
    <>
      <BattleLogic />
      <Map />
      <img className={styles.legend} src={legend} alt="legend" />
      <button className={styles.button} onClick={onClick}>End turn</button>
    </>
  )
}

export default App