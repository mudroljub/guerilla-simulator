import MapContainer from '../../components/Map/MapContainer'
import { GamePhase } from '../../types/types'
import Map from '../../components/Map/Map'
import legend from '../../assets/images/legenda.webp'
import styles from '../../App.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Modal from '../../components/Modal/Modal'
import { useStore } from '../../store/store'
import EndTurn from './EndTurn'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles in progress...',
  [GamePhase.MOBILIZATION_PHASE]: 'Deploy new partisans to your territories.',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

export default function MapScreen() {
  const { state: { phase } } = useStore()

  return (
    <>
      <MapContainer>
        <Map />
      </MapContainer>

      <Modal />

      <p className={shared.message}>
        {phase.replace('_', ' ')}: {message[phase]}
      </p>

      <img className={styles.legend} src={legend} alt="legend" />

      <EndTurn />
    </>
  )
}