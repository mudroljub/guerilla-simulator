import { useState } from 'react'
import shared from '../../assets/styles/shared.module.scss'
import styles from './Battle.module.scss'
import { useLiberatedNeighbors, useStore } from '../../store/store'
import { Fraction, GamePhase, RegionState } from '../../types/types'

interface Props {
  region: RegionState
  onConfirm: (targetRegion: string) => void
  disabled: boolean
}

const Retreat = ({ region, onConfirm, disabled }: Props) => {
  const { state } = useStore()
  const { phase, regionDict } = state
  const liberatedNeighbors = useLiberatedNeighbors(region.name)
  const [isRetreating, setIsRetreating] = useState(false)

  const regions = (phase === GamePhase.ATTACK_PHASE ? liberatedNeighbors : region.neighbors).map(region => regionDict[region])
  const [selectedRetreatRegion, setSelectedRetreatRegion] = useState(regions[0].name)

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

  return (
    <div className={styles.retreatWrapper}>
      <p>Retreat to:</p>
      <select
        value={selectedRetreatRegion}
        onChange={e => setSelectedRetreatRegion(e.target.value)}
      >
        {regions.map(region => (
          <option key={region.name} value={region.name}>{region.name} {region.fraction === Fraction.Partisan ? '★' : '✠'}</option>
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