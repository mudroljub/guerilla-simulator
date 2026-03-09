import MapContainer from '../../components/Map/MapContainer'
import { GamePhase } from '../../types/types'
import Map from '../../components/Map/Map'
import legend from '../../assets/images/legenda.webp'
import styles from '../../App.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Modal from '../../components/Modal/Modal'
import { useStore } from '../../store/store'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles are in progress...',
  [GamePhase.MOBILIZATION]: 'Deploy new units to your territories.',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

export default function MapScreen() {
  const { dispatch, state: { phase } } = useStore()
  const onClick = () => dispatch({ type: 'END_TURN' })

  return (
    <>
      {/* redosled određuje z-index */}
      <MapContainer>
        <Map />
      </MapContainer>
      <Modal />
      <p className={shared.message}>{message[phase]}</p>
      <img className={styles.legend} src={legend} alt="legend" />
      <button className={shared.roundButton} onClick={onClick}>End turn</button>
    </>
  )
}