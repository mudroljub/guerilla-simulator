import { useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import { useStore, useRegionStateExtended } from "../../store/store";
import { RegionData } from "../../types/types";

interface Props {
  region: RegionData;
}

export default function AttackOptions({ region }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore()
  const { partisanNeighbors } = useRegionStateExtended(region)

  const [attackingRegion, setAttackingRegion] = useState(partisanNeighbors[0])

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
    setAttackingRegion(partisanNeighbors[0])
  }, [partisanNeighbors])

  return (
    <div>
      <p className={styles.text}>
        <strong>Attack from:</strong>{' '}
        <select value={attackingRegion} onChange={e => setAttackingRegion(e.target.value)}>
          {partisanNeighbors.map(opt => (
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
        />
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