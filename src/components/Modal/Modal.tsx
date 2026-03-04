import classnames from "classnames";
import { useEffect, useState } from "react";
import { useStore, useIsAttackable } from "../../store/store";
import { Fraction, RegionState } from "../../types/types";
import styles from "./Modal.module.scss";
import AttackOptions from './AttackOptions'
import Units from './Units'

interface Props {
  region: RegionState;
}

export default function Modal({ region }: Props) {
  const { state: { regionDict }, dispatch } = useStore()
  const attackable = useIsAttackable(region.name)
  const [showMore, setShowMore] = useState(false)

  const regionState: RegionState = regionDict[region.name]

  const { garrison, fraction } = regionState

  useEffect(() => {
    setShowMore(false)
  }, [region]);

  const getFlag = (fraction: Fraction) => fraction === Fraction.Partisan
    ? <img alt="flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg/330px-Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg.png" className={styles.flag} />
    : <img alt="flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Germany_%281935%E2%80%931945%29.svg/330px-Flag_of_Germany_%281935%E2%80%931945%29.svg.png" className={styles.flag} />

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <button
          onClick={() => dispatch({ type: "DESELECT" })}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2 className={classnames(styles.title, {
          [styles.black]: fraction === Fraction.German
        })}>
          {getFlag(fraction)} {region.name}
        </h2>

        <p className={styles.text}>
          <strong>Population:</strong> {region.population}
        </p>

        <Units troops={garrison} fraction={fraction} />

        {
          region.attackingForces && <Units troops={region.attackingForces} fraction={Fraction.Partisan} />
        }

        {attackable && (
          showMore
            ? <AttackOptions region={region} />
            : <button
                className={styles.attackButton}
                onClick={() => setShowMore(true)}
              >
                Attack {region.name} ⚔️
              </button>
        )}
      </div>
    </div>
  )
}