import classnames from "classnames";
import { IRegion, RegionState } from "../../types/types";
import styles from "./Region.module.scss";
import { useMapStore } from "../../store/mapStore";
import { useMemo } from "react";
import { getPathData, getRadius } from "./utils";

const CITY_THRESHOLD = 0.04;
const TEXT_OFFSET_Y = -10;

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

  const pathData = useMemo(() => getPathData(region.polygon, region.position), [region.polygon, region.position])
  const radius = useMemo(() => getRadius(region.size), [region.size])

  return (
    <g 
      className={classnames(styles.region, stateStyle[state])} 
      onClick={() => dispatch({ type: "TOGGLE_REGION", name: region.name })}
    >
      <path d={pathData} />
      <circle
        cx={region.position.x}
        cy={region.position.y}
        r={radius}
        className={classnames(styles.regionCenter, {
          [styles.hidden]: region.size <= CITY_THRESHOLD,
        })}
      />
      <text
        x={region.position.x}
        y={region.position.y + TEXT_OFFSET_Y}
        textAnchor="middle"
        className={classnames(styles.label, {
          [styles.hidden]: region.size <= CITY_THRESHOLD,
        })}
      >
        {region.size > CITY_THRESHOLD ? region.name.toUpperCase() : region.name}
      </text>
    </g>
  );
}
