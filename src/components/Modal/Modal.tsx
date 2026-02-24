import { useStore } from "../../store/store";
import { RegionData } from "../../types/types";
import styles from "./Modal.module.scss";

interface Props {
  selected: RegionData;
}

export default function Modal({ selected }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore();
  console.log(selected);
  
  const region = regionDict[selected.name];

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