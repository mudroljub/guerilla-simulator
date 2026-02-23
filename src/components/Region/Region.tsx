import classnames from "classnames";
import { IRegion, RegionState } from "../../types/types";
import styles from "./Region.module.scss";
import { useMapStore } from "../../store/mapStore";
import { useMemo } from "react";
import { getPathData, getRadius } from "./utils";

const MAX_RADIUS = 150;
const TEXT_OFFSET_Y = -10;
const LABEL_THRESHOLD = 0.03;

interface Props {
  region: IRegion;
}

const stateStyle = {
  [RegionState.Occupied]: styles.occupied,
  [RegionState.Attacked]: styles.attacked,
  [RegionState.Liberated]: styles.liberated,
};

export default function Region({ region }: Props) {
  const { mapState, dispatch } = useMapStore();
  const state = mapState[region.name];
  
  const pathData = useMemo(() => getPathData(region.polygon, region.position, MAX_RADIUS), [region.polygon, region.position])
  const radius = useMemo(() => getRadius(region.size), [region.size])

  return (
    <g className={classnames(styles.region, stateStyle[state])}>
      <path
        d={pathData}
        onClick={() => dispatch({ type: "TOGGLE_REGION", name: region.name })}
      />
      <circle
        cx={region.position.x}
        cy={region.position.y}
        r={radius}
        className={styles.regionCenter}
      />
      <text
        x={region.position.x}
        y={region.position.y + TEXT_OFFSET_Y}
        textAnchor="middle"
        className={classnames(styles.label, {
          [styles.hidden]: region.size <= LABEL_THRESHOLD,
        })}
      >
        {region.name.toUpperCase()}
      </text>
    </g>
  );
}
