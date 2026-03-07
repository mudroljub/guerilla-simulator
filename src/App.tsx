import Map from './components/Map/Map'
import MapContainer from './components/Map/MapContainer'
import legend from './assets/images/legenda.webp'
import styles from './App.module.scss'
import { useStore } from './store/store'
import Modal from './components/Modal/Modal'
import Battle from './components/Battle/Battle'
import { GamePhase } from './types/types'

function App() {
  const { state, dispatch } = useStore()
  const { phase, battleQueue } = state

  // TODO: dodati uslov, samo ako ima napada
  const onClick = () => dispatch({ type: 'START_COMBAT_PHASE' })

  return (
    <>
      <MapContainer>
        <Map />
      </MapContainer>
      <Modal />
      <img className={styles.legend} src={legend} alt="legend" />
      <button className={styles.button} onClick={onClick}>End turn</button>

      {phase === GamePhase.COMBAT_PHASE && (
        <Battle key={battleQueue[0]} />
      )}
    </>
  )
}

export default App