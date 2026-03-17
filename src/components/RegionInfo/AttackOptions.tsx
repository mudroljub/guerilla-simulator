import { ChangeEvent, useEffect, useState } from 'react'
import styles from './RegionInfo.module.scss'
import shared from '../../assets/styles/shared.module.scss'
import { useStore, useLiberatedNeighbors } from '../../store/store'
import { RegionState } from '../../types/types'

export default function AttackOptions({ region }: { region: RegionState }) {
  const { state: { regionDict, selectedAttackingRegion }, dispatch } = useStore()
  const neighbors = useLiberatedNeighbors(region.name)

  const attackingRegion = selectedAttackingRegion || neighbors[0]
  const max = regionDict[attackingRegion].garrison.infantry
  const [attackingForce, setAttackingForce] = useState(Math.round(max * 0.5))

  const hasExistingAttack = Object.values(region.attackingForces || {}).some(count => count > 0)

  useEffect(() => setAttackingForce(Math.round(max * 0.5)), [attackingRegion, max])

  useEffect(() => {
    dispatch({ type: 'SELECT_ATTACKING_REGION', regionName: attackingRegion })
  }, [attackingRegion, dispatch])

  useEffect(() => {
    dispatch({ type: 'SELECT_ATTACKING_REGION', regionName: neighbors[0] })
  }, [dispatch, neighbors, region.name])

  const inputProps = {
    min: 1,
    max,
    value: attackingForce,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setAttackingForce(Number(e.target.value))
  }
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) =>
    dispatch({ type: 'SELECT_ATTACKING_REGION', regionName: e.target.value })

  return (
    <div>
      <input type="range" className={styles.range} {...inputProps} />

      <p className={styles.text}>
        Attack from{' '}
        <select
          value={attackingRegion}
          onChange={onSelect}
        >
          {neighbors.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <br/>

        with <input type="number" {...inputProps} /> {attackingForce > 1 ? 'Partisans' : 'Partisan'}
      </p>

      <button className={shared.button} onClick={() => dispatch({
        type: 'ATTACK_REGION',
        attackedRegion: region.name,
        attackingRegion,
        attackingForces: { infantry: attackingForce }
      })}>
        {hasExistingAttack ? 'Send more troops ⚔️' : 'Send troops ⚔️'}
      </button>
    </div>
  )
}