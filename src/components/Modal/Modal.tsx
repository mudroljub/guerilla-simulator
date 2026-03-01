import { useEffect, useState } from "react";
import { useStore, useRegionStateExtended } from "../../store/store";
import { RegionData, RegionState } from "../../types/types";
import styles from "./Modal.module.scss";
import AttackOptions from '../AttackOptions/AttackOptions'

interface Props {
  region: RegionData;
}

export default function Modal({ region }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore()
  const { attackable } = useRegionStateExtended(region)
  const [expandAttack, setExpandAttack] = useState(false)
  
  const regionState: RegionState = regionDict[region.name]

  const garrison = regionState.garrison

  useEffect(() => {
    setExpandAttack(false)
  }, [region]);

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <button
          onClick={() => dispatch({ type: "DESELECT" })}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2 className={styles.title}>{region.name}</h2>

        <p className={styles.text}>
          <strong>Population:</strong> {region.population}
        </p>

        <p className={styles.text}>
          <strong>Garrison:</strong>
        </p>
        <ul className={styles.text}>
          <li>Infantry: {garrison.infantry}</li>
          {garrison?.artillery! > 0 && <li>Artillery: {garrison.artillery}</li>}
          {garrison?.tanks! > 0 && <li>Tanks: {garrison.tanks}</li>}
          {garrison?.aircraft! > 0 && <li>Aircraft: {garrison.aircraft}</li>}
        </ul>

        <p className={styles.text}>
          <strong>Faction:</strong> {regionState.fraction}
        </p>

        {attackable && 
          <button
            className={styles.attackButton}
            onClick={() => setExpandAttack(true)}
          >
            Attack ⚔️
          </button>
        }
        {expandAttack &&
          <AttackOptions region={region} />
        }
      </div>
    </div>
  )
}