import MapContainer from '../../components/Map/MapContainer'
import { GamePhase } from '../../types/types'
import Map from '../../components/Map/Map'
import legend from '../../assets/images/legenda.webp'
import styles from '../../App.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import RegionInfo from '../../components/RegionInfo/RegionInfo'
import { useStore } from '../../store/store'
import EndTurn from './EndTurn'
import MobilizationOverlay from '../../components/Mobilization/MobilizationOverlay'
import BombardmentOverlay from '../../components/Bombardment/BombardmentOverlay'
import { useEffect, useState } from 'react'
import MobilizationReport from './MobilizationReport'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles in progress...',
  [GamePhase.MOBILIZATION_PHASE]: 'New volunteers are joining the partisans!',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

export default function MapScreen() {
  const { state: { phase } } = useStore()

  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    if (phase !== GamePhase.MOBILIZATION_PHASE) {
      setShowReport(false)
      return
    }

    const t = setTimeout(() => setShowReport(true), 3000)
    return () => clearTimeout(t)

  }, [phase])

  return (
    <>
      <MapContainer>
        <Map />
        {phase === GamePhase.MOBILIZATION_PHASE && <MobilizationOverlay />}
        {showReport && (
          <MobilizationReport onClose={() => setShowReport(false)} />
        )}
        {phase === GamePhase.BOMBARDMENT && <BombardmentOverlay />}
      </MapContainer>

      <RegionInfo />

      <p className={shared.message}>
        {phase.replace('_', ' ')}: {message[phase]}
      </p>

      <img className={styles.legend} src={legend} alt="legend" />

      <EndTurn />
    </>
  )
}