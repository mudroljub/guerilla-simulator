import { useState } from "react";
import styles from "./AttackOptions.module.scss";
import { useStore } from "../../store/store";
import { Fraction, RegionData, RegionState } from "../../types/types";

interface Props {
  region: RegionData;
}

export default function AttackOptions({ region }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore()

  const partisanNeighbors = region.neighbors.filter(n => regionDict[n].fraction === Fraction.Partisan)

  const [attackingRegion, setAttackingRegion] = useState(partisanNeighbors[0])

  const regionState: RegionState = regionDict[region.name]

  const garrison = regionState.garrison

  const attack = () => dispatch({ type: "ATTACK", region: region.name, assaultTroops: garrison })

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
    </div>
  )
}