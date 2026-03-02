import classnames from "classnames";
import { useEffect, useState } from "react";
import { useStore, useRegionStateExtended } from "../../store/store";
import { Fraction, RegionData, RegionState } from "../../types/types";
import styles from "./Modal.module.scss";
import AttackOptions from './AttackOptions'

interface Props {
  region: RegionData;
}

export default function Modal({ region }: Props) {
  const { mapState: { regionDict }, dispatch } = useStore()
  const { attackable } = useRegionStateExtended(region)
  const [showMore, setShowMore] = useState(false)

  const regionState: RegionState = regionDict[region.name]

  const { garrison, fraction } = regionState

  useEffect(() => {
    setShowMore(false)
  }, [region]);

  const getIcon = (fraction: Fraction) => fraction === Fraction.Partisan
    ? <span>★</span>
    : <span className={styles.black}>✠</span>
  const getFlag = (fraction: Fraction) => fraction === Fraction.Partisan
    ? <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg/330px-Flag_of_Yugoslavia_%281943%E2%80%931946%29.svg.png" className={styles.flag} />
    : <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Germany_%281935%E2%80%931945%29.svg/330px-Flag_of_Germany_%281935%E2%80%931945%29.svg.png" className={styles.flag} />

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

        <p className={styles.text}>
          <strong>{fraction}s:</strong>
        </p>
        <ul className={styles.text}>
          <li>Infantry: {garrison.infantry} <img className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Civil_Military_Coordination_-_The_Noun_Project.svg" /></li>
          {garrison?.artillery! > 0 && <li>Artillery: {garrison.artillery} <img className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/6/64/Maki1-historic-15.svg" /></li>}
          {garrison?.tanks! > 0 && <li>Tanks: {garrison.tanks} <img className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/f/ff/CH-Zusatztafel-Panzer.svg" /></li>}
          {garrison?.aircraft! > 0 && <li>Aircraft: {garrison.aircraft} <img className={styles.icon} src="https://upload.wikimedia.org/wikipedia/commons/1/19/Black_aircraft_icon.svg" /></li>}
        </ul>

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