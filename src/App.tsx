import Map from './components/Map/Map'
import MapContainer from './components/Map/MapContainer'
import legend from './assets/images/legenda.webp'
import styles from './App.module.scss'
import { useStore } from './store/store'
import Modal from './components/Modal/Modal'
import Battle from './components/Battle/Battle'
import { GamePhase } from './types/types'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles are in progress...',
  [GamePhase.MOBILIZATION]: 'Deploy new units to your territories.',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

function App() {
  const { state, dispatch } = useStore()
  const { phase, battleQueue } = state

  const onClick = () => dispatch({ type: 'END_TURN' })

  return (
    <>
      {/* redosled određuje z-index */}
      <MapContainer>
        <Map />
      </MapContainer>
      <Modal />
      <p className={styles.message}>{message[phase]}</p>
      <img className={styles.legend} src={legend} alt="legend" />
      <button className={styles.button} onClick={onClick}>End turn</button>

      {phase === GamePhase.COMBAT_PHASE && (
        <Battle key={battleQueue[0]} />
      )}
    </>
  )
}

export default App