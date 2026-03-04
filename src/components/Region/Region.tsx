import classnames from "classnames";
import { Fraction, RegionState } from "../../types/types";
import styles from "./Region.module.scss";
import { useStore, useIsAttackable } from "../../store/store";
import { useMemo } from "react";
import { getPathData, getRadius } from "./utils";
import { CITY_LABEL_THRESHOLD } from "../../config";

const TEXT_OFFSET_Y = -10;

const stateStyle = {
  [Fraction.German]: styles.occupied,
  [Fraction.Partisan]: styles.liberated,
}

interface Props {
  region: RegionState;
}

export default function Region({ region }: Props) {
  const { state: { selected }, dispatch } = useStore();
  const attackable = useIsAttackable(region.name)

  const regionFraction = region.fraction
  const isSelected = selected?.name === region.name

  const isOccupiedNeighbor = selected && 
    regionFraction === Fraction.German && 
    selected.fraction === Fraction.Partisan && 
    selected.neighbors.includes(region.name)

  const pathData = useMemo(() => getPathData(region.polygon), [region.polygon])
  const radius = useMemo(() => getRadius(region.size), [region.size])

  const toggle = () => dispatch({
    type: isSelected ? "DESELECT" : "SELECT_REGION",
    region,
  });

  return (
    <g
      id={region.name}
      className={classnames(styles.region, stateStyle[regionFraction], { 
        [styles.selected]: isSelected, 
        [styles.blush]: isOccupiedNeighbor || attackable,
      })}
      onClick={toggle}
    >
      <path
        className={classnames(styles.path)}
        d={pathData}
      />
      {region?.attackingForces ? 
        <text
          x={region.position.x}
          y={region.position.y + 5}
          textAnchor="middle"
          className={styles.attackedIcon}
        >
          💥
        </text>
        :
        <circle
          cx={region.position.x}
          cy={region.position.y}
          r={radius}
          className={classnames(styles.regionCenter, {
            [styles.toggle]: region.size <= CITY_LABEL_THRESHOLD,
          })}
        />
      }
      <text
        x={region.position.x}
        y={region.position.y + TEXT_OFFSET_Y}
        textAnchor="middle"
        className={classnames(styles.label, {
          [styles.toggle]: region.size <= CITY_LABEL_THRESHOLD,
        })}
      >
        {region.size > CITY_LABEL_THRESHOLD ? region.name.toUpperCase() : region.name}
      </text>
    </g>
  );
}
