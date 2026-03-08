import { useEffect, useState } from 'react'
import styles from './Modal.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import { useStore, useLiberatedNeighbors } from '../../store/store'
import { RegionState } from '../../types/types'

interface Props {
  region: RegionState;
}

export default function AttackOptions({ region }: Props) {
  const { state: { regionDict }, dispatch } = useStore()
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [attackingRegion, setAttackingRegion] = useState(liberatedNeighbors[0])
  const defaultAttackForce = Math.round(regionDict[attackingRegion].garrison.infantry * 0.5)
  const [attackingForce, setAttackingForce] = useState(defaultAttackForce)

  const attack = () => dispatch({
    type: 'ATTACK_REGION',
    attackedRegion: region.name,
    attackingRegion,
    attackingForces: {
      infantry: attackingForce,
    },
  })

  useEffect(() => {
    setAttackingForce(defaultAttackForce)
  }, [defaultAttackForce])

  useEffect(() => {
    if (!liberatedNeighbors.includes(attackingRegion))
      setAttackingRegion(liberatedNeighbors[0])
  }, [liberatedNeighbors, attackingRegion])

  return (
    <div>
      <input
        type="range"
        className={styles.range}
        min={1}
        max={regionDict[attackingRegion].garrison.infantry}
        value={attackingForce}
        onChange={e => setAttackingForce(Number(e.target.value))}
      />
      <p className={styles.text}>
        <span>Attack with</span>{' '}
        <input
          type="number"
          min={1}
          max={regionDict[attackingRegion].garrison.infantry}
          value={attackingForce}
          onChange={e => setAttackingForce(Number(e.target.value))}
        />{' '}
        {attackingForce > 1 ? 'Partisans' : 'Partisan'}{' '}
        <span>from</span>{' '}
        <select value={attackingRegion} onChange={e => setAttackingRegion(e.target.value)}>
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