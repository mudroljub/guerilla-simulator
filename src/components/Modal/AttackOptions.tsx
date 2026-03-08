import { useCallback, useEffect, useState } from 'react'
import styles from './Modal.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import { useStore, useLiberatedNeighbors } from '../../store/store'
import { RegionState } from '../../types/types'

interface Props {
  region: RegionState;
}

export default function AttackOptions({ region }: Props) {
  const { state: { regionDict, selectedAttackingRegion }, dispatch } = useStore()
  const liberatedNeighbors = useLiberatedNeighbors(region.name)
  const attackingRegion = selectedAttackingRegion ?? liberatedNeighbors[0]

  const defaultAttackForce = Math.round(regionDict[attackingRegion].garrison.infantry * 0.5)
  const [attackingForce, setAttackingForce] = useState(defaultAttackForce)

  const setSelectedRegion = useCallback((value: string) => {
    dispatch({
      type: 'SELECT_ATTACKING_REGION',
      regionName: value,
    })
  }, [dispatch])

  const attack = () => {
    if (!attackingRegion) return
    dispatch({
      type: 'ATTACK_REGION',
      attackedRegion: region.name,
      attackingRegion,
      attackingForces: {
        infantry: attackingForce,
      },
    })
  }

  useEffect(() => {
    if (attackingRegion)
      setAttackingForce(defaultAttackForce)

  }, [attackingRegion, defaultAttackForce])

  useEffect(() => {
    if (!liberatedNeighbors.includes(attackingRegion))
      setSelectedRegion(liberatedNeighbors[0])
  }, [liberatedNeighbors, attackingRegion, setSelectedRegion])

  return (
    <div>
      <input
        type="range"
        className={styles.range}
        min={1}
        max={attackingRegion ? regionDict[attackingRegion].garrison.infantry : 1}
        value={attackingForce}
        onChange={e => setAttackingForce(Number(e.target.value))}
      />
      <p className={styles.text}>
        <span>Attack with</span>{' '}
        <input
          type="number"
          min={1}
          max={attackingRegion ? regionDict[attackingRegion].garrison.infantry : 1}
          value={attackingForce}
          onChange={e => setAttackingForce(Number(e.target.value))}
        />{' '}
        {attackingForce > 1 ? 'Partisans' : 'Partisan'}{' '}
        <span>from</span>{' '}
        <select
          value={attackingRegion}
          onChange={e => setSelectedRegion(e.target.value)}
        >
          {liberatedNeighbors.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </p>
      <button
        className={shared.button}
        onClick={attack}
      >
        Send troops ⚔️
      </button>
    </div>
  )
}