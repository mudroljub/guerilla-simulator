import { useEffect, useState } from 'react'
import styles from './Modal.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import { useStore, useLiberatedNeighbors } from '../../store/store'
import { RegionState } from '../../types/types'

interface Props {
  region: RegionState
}

export default function AttackOptions({ region }: Props) {
  const { state: { regionDict, selectedAttackingRegion }, dispatch } = useStore()
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const attackingRegion = selectedAttackingRegion || liberatedNeighbors[0]
  const maxInfantry = regionDict[attackingRegion].garrison.infantry

  const [attackingForce, setAttackingForce] = useState(Math.round(maxInfantry * 0.5))

  useEffect(() => {
    setAttackingForce(Math.round(maxInfantry * 0.5))
  }, [attackingRegion, maxInfantry])

  const attack = () => {
    dispatch({
      type: 'ATTACK_REGION',
      attackedRegion: region.name,
      attackingRegion,
      attackingForces: { infantry: attackingForce }
    })
  }

  return (
    <div>
      <input
        type="range"
        className={styles.range}
        min={1}
        max={maxInfantry}
        value={attackingForce}
        onChange={e => setAttackingForce(Number(e.target.value))}
      />

      <p className={styles.text}>
        <span>Attack from</span>{' '}
        <select
          value={attackingRegion}
          onChange={e => dispatch({ type: 'SELECT_ATTACKING_REGION', regionName: e.target.value })}
        >
          {liberatedNeighbors.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <br/>

        <span>with</span>{' '}
        <input
          type="number"
          min={1}
          max={maxInfantry}
          value={attackingForce}
          onChange={e => setAttackingForce(Number(e.target.value))}
        />{' '}
        {attackingForce > 1 ? 'Partisans' : 'Partisan'}
      </p>

      <button className={shared.button} onClick={attack}>
        Send troops ⚔️
      </button>
    </div>
  )
}