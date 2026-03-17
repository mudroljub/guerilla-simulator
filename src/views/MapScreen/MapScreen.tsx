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
import BombingOverlay from '../../components/Bombing/BombingOverlay'
import { useEffect, useState } from 'react'
import MobilizationReport from '../../components/Mobilization/MobilizationReport'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles in progress...',
  [GamePhase.MOBILIZATION_PHASE]: 'New volunteers are joining the partisans!',
  [GamePhase.BOMBING_PHASE]: 'Enemy planes are bombing our towns',
}

export default function MapScreen() {
  const { state: { phase } } = useStore()

  const [showMobilizationReport, setShowMobilizationReport] = useState(false)

  useEffect(() => {
    if (phase !== GamePhase.MOBILIZATION_PHASE) {
      setShowMobilizationReport(false)
      return
    }

    const t = setTimeout(() => setShowMobilizationReport(true), 3000)
    return () => clearTimeout(t)

  }, [phase])

  return (
    <>
      <MapContainer>
        <Map />
        {phase === GamePhase.MOBILIZATION_PHASE && <MobilizationOverlay />}
        {showMobilizationReport && (
          <MobilizationReport onClose={() => setShowMobilizationReport(false)} />
        )}
        {phase === GamePhase.BOMBING_PHASE && <BombingOverlay />}
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