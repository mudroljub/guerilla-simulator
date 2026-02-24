import { useStore } from "../../store/store";
import { RegionData, RegionState } from "../../types/types";
import styles from "./Modal.module.scss";

interface Props {
  region: RegionData;
}

export default function Modal({ region }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore();
  
  const regionState: RegionState = regionDict[region.name];

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
          <strong>Garrison:</strong> {regionState.garrison}
        </p>
        <p className={styles.text}>
          <strong>Faction:</strong> {regionState.fraction}
        </p>

        <button
          className={styles.attackButton}
          onClick={() =>
            dispatch({ type: "ATTACK_REGION", region: region.name })
          }
        >
          Attack
        </button>
      </div>
    </div>
  );
}