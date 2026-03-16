import { useEffect, useState } from 'react'
import styles from './RegionInfo.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import { useStore, useLiberatedNeighbors } from '../../store/store'
import { RegionState } from '../../types/types'

export default function AttackOptions({ region }: { region: RegionState }) {
  const { state: { regionDict, selectedAttackingRegion }, dispatch } = useStore()
  const neighbors = useLiberatedNeighbors(region.name)

  const source = selectedAttackingRegion || neighbors[0]
  const max = regionDict[source].garrison.infantry
  const [attackingForce, setAttackingForce] = useState(Math.round(max * 0.5))

  const hasExistingAttack = Object.values(region.attackingForces || {}).some(count => count > 0)

  useEffect(() => setAttackingForce(Math.round(max * 0.5)), [source, max])

  const commonProps = {
    min: 1,
    max,
    value: attackingForce,
    onChange: (e: any) => setAttackingForce(Number(e.target.value))
  }

  return (
    <div>
      <input type="range" className={styles.range} {...commonProps} />

      <p className={styles.text}>
        Attack from{' '}
        <select
          value={source}
          onChange={e => dispatch({ type: 'SELECT_ATTACKING_REGION', regionName: e.target.value })}
        >
          {neighbors.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <br/>

        with <input type="number" {...commonProps} /> {attackingForce > 1 ? 'Partisans' : 'Partisan'}
      </p>

      <button className={shared.button} onClick={() => dispatch({
        type: 'ATTACK_REGION',
        attackedRegion: region.name,
        attackingRegion: source,
        attackingForces: { infantry: attackingForce }
      })}>
        {hasExistingAttack ? 'Send more troops ⚔️' : 'Send troops ⚔️'}
      </button>
    </div>
  )
}