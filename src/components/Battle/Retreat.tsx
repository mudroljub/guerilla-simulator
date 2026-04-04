import { useState } from 'react'
import shared from '../../assets/styles/shared.module.scss'
import styles from './Battle.module.scss'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { GamePhase, RegionState } from '../../types/types'

interface Props {
  region: RegionState
  onConfirm: (targetRegion: string) => void
  disabled: boolean
}

const Retreat = ({ region, onConfirm, disabled }: Props) => {
  const { state } = useStore()
  const liberatedNeighbors = useLiberatedNeighbors(region.name)
  const [isRetreating, setIsRetreating] = useState(false)
  const [selectedRetreatRegion, setSelectedRetreatRegion] = useState(liberatedNeighbors[0] || '')

  if (!isRetreating)
    return (
      <button
        className={shared.roundButton}
        style={{ left: '1rem' }}
        onClick={() => setIsRetreating(true)}
        disabled={disabled}
      >
        Retreat
      </button>
    )

  const retreatingRegions = state.phase === GamePhase.ATTACK_PHASE ? liberatedNeighbors : region.neighbors

  return (
    <div className={styles.retreatWrapper}>
      <p>Retreat to:</p>
      <select
        value={selectedRetreatRegion}
        onChange={e => setSelectedRetreatRegion(e.target.value)}
      >
        {retreatingRegions.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <div>
        <button onClick={() => onConfirm(selectedRetreatRegion)} >
          Confirm
        </button>
        <button onClick={() => setIsRetreating(false)} >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Retreat