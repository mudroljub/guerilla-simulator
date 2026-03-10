import MapContainer from '../../components/Map/MapContainer'
import { GamePhase } from '../../types/types'
import Map from '../../components/Map/Map'
import legend from '../../assets/images/legenda.webp'
import styles from '../../App.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import Modal from '../../components/Modal/Modal'
import { useStore } from '../../store/store'
import EndTurn from './EndTurn'
import MobilizationOverlay from '../../components/Mobilization/MobilizationOverlay'
import BombardmentOverlay from '../../components/Bombardment/BombardmentOverlay'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles in progress...',
  [GamePhase.MOBILIZATION_PHASE]: 'New volunteers are joining the resistance!',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

export default function MapScreen() {
  const { state: { phase, regionDict } } = useStore()

  const getTotalMobilized = () => Object.values(regionDict).reduce((acc, region) => acc + region.lastMobilizedCount, 0)

  const getMessage = () => {
    const baseMessage = message[phase]

    if (phase === GamePhase.MOBILIZATION_PHASE) {
      const total = getTotalMobilized()
      return `${total.toLocaleString()} new volunteers have joined the National Liberation Army of Yugoslavia!`
    }

    return baseMessage
  }

  return (
    <>
      <MapContainer>
        <Map />
        {phase === GamePhase.MOBILIZATION_PHASE && <MobilizationOverlay />}
        {phase === GamePhase.BOMBARDMENT && <BombardmentOverlay />}
      </MapContainer>

      <Modal />

      <p className={shared.message}>
        {phase.replace('_', ' ')}: {getMessage()}
      </p>

      <img className={styles.legend} src={legend} alt="legend" />

      <EndTurn />
    </>
  )
}