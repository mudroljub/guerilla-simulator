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
import BombingReport from '../../components/Bombing/BombingReport'

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move Partisans into adjacent enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles in progress...',
  [GamePhase.MOBILIZATION_PHASE]: 'New volunteers are joining the partisans!',
  [GamePhase.BOMBING_PHASE]: 'Enemy planes are bombing our towns',
  [GamePhase.ENEMY_OFFENSIVE]: 'A major enemy offensive has begun',
}

export default function MapScreen() {
  const { state: { phase, bombings, bombingIndex = 0 } } = useStore()

  const [showMobilizationReport, setShowMobilizationReport] = useState(false)
  const showBombingReport = phase === GamePhase.BOMBING_PHASE && bombingIndex === bombings.length
  const showPhaseMassage = !(showBombingReport || showMobilizationReport)

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
        {phase === GamePhase.MOBILIZATION_PHASE && (
          <>
            <MobilizationOverlay />
            {showMobilizationReport && (
              <MobilizationReport onClose={() => setShowMobilizationReport(false)} />
            )}
          </>
        )}
        {phase === GamePhase.BOMBING_PHASE && (
          <>
            {bombings[bombingIndex] && <BombingOverlay />}
            {showBombingReport && <BombingReport />}
          </>
        )}
      </MapContainer>

      <RegionInfo />

      {showPhaseMassage &&
        <p className={shared.message}>
          {phase.replace('_', ' ')}: {message[phase]}
        </p>
      }

      <img className={styles.legend} src={legend} alt="legend" />

      <EndTurn />
    </>
  )
}