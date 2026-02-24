import { useStore } from "../../store/store";
import styles from "./Modal.module.scss";

export default function Modal() {
  const { mapState, dispatch } = useStore();

  const selected = mapState.selected;
  if (!selected) return null;

  const region = mapState.regionDict[selected.name];

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <button
          onClick={() => dispatch({ type: "DESELECT" })}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2 className={styles.title}>{selected.name}</h2>

        <p className={styles.text}>
          <strong>Garrison:</strong> {region.garrison}
        </p>
        <p className={styles.text}>
          <strong>Faction:</strong> {region.fraction}
        </p>

        <button
          className={styles.attackButton}
          onClick={() =>
            dispatch({ type: "ATTACK_REGION", region: selected.name })
          }
        >
          Attack
        </button>
      </div>
    </div>
  );
}