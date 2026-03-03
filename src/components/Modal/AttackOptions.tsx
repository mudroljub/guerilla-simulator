import { useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import { useStore, useLiberatedNeighbors } from "../../store/store";
import { RegionState } from "../../types/types";

interface Props {
  region: RegionState;
}

export default function AttackOptions({ region }: Props) {
  const { state: { regionDict }, dispatch } = useStore()
  const liberatedNeighbors = useLiberatedNeighbors(region.name)

  const [attackingRegion, setAttackingRegion] = useState(liberatedNeighbors[0])

  const [attackingForce, setAttackingForce] = useState(regionDict[attackingRegion].garrison.infantry)

  const attack = () => dispatch({ 
    type: "ATTACK", 
    attackedRegion: region.name, 
    attackingRegion,
    attackingForces: {
      infantry: attackingForce,
    },
  })

  useEffect(() => {
    setAttackingForce(regionDict[attackingRegion].garrison.infantry)
  }, [attackingRegion, regionDict])

  useEffect(() => {
    if (!liberatedNeighbors.includes(attackingRegion))
      setAttackingRegion(liberatedNeighbors[0])
  }, [liberatedNeighbors, attackingRegion])

  return (
    <div>
      <p className={styles.text}>
        <strong>Attack from:</strong>{' '}
        <select value={attackingRegion} onChange={e => setAttackingRegion(e.target.value)}>
          {liberatedNeighbors.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </p>
      <p className={styles.text}>
        <strong>Attack with:</strong>{' '}
        <input
          type="number"
          min={1}
          max={regionDict[attackingRegion].garrison.infantry}
          value={attackingForce}
          onChange={(e) => setAttackingForce(Number(e.target.value))}
        />{' '}
        {attackingForce > 1 ? 'Partisans' : 'Partisan'}
        <input
          type="range"
          min={1}
          max={regionDict[attackingRegion].garrison.infantry}
          value={attackingForce}
          onChange={(e) => setAttackingForce(Number(e.target.value))}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
        />
      </p>
      <button
        className={styles.attackButton}
        onClick={attack}
      >
        Send troops ⚔️
      </button>
    </div>
  )
}