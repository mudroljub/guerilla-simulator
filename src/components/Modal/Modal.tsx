import { useMapStore } from "../../store/store";
import styles from "./Modal.module.scss";

export default function Modal() {
  const { mapState, dispatch } = useMapStore();

  const selected = mapState.selected;
  if (!selected) return null;

  const region = mapState.regionDict[selected];

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        <button
          onClick={() => dispatch({ type: "DESELECT" })}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2 className={styles.modalTitle}>{selected}</h2>

        <p><strong>Garrison:</strong> {region.garrison}</p>
        <p><strong>Faction:</strong> {region.fraction}</p>

        <button
          className={styles.attackButton}
          onClick={() => dispatch({ type: "ATTACK_REGION", region: selected })}
        >
          Attack
        </button>
      </div>
    </div>
  );
}