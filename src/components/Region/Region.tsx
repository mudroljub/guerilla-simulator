import classnames from "classnames";
import { RegionData, Status } from "../../types/types";
import styles from "./Region.module.scss";
import { useStore } from "../../store/store";
import { useMemo } from "react";
import { getPathData, getRadius } from "./utils";

const CITY_THRESHOLD = 0.04;
const TEXT_OFFSET_Y = -10;

const stateStyle = {
  [Status.Occupied]: styles.occupied,
  [Status.Attacked]: styles.attacked,
  [Status.Liberated]: styles.liberated,
};

interface Props {
  region: RegionData;
}

export default function Region({ region }: Props) {
  const { mapState, dispatch } = useStore();
  const status = mapState.regionDict[region.name].status;
  const isSelected = mapState.selected?.name === region.name;

  const pathData = useMemo(() => getPathData(region.polygon), [region.polygon])
  const radius = useMemo(() => getRadius(region.size), [region.size])

  const toggle = () => dispatch({
    type: isSelected ? "DESELECT" : "SELECT_REGION",
    region,
  });

  return (
    <g
      className={classnames(styles.region, stateStyle[status], { [styles.selected]: isSelected })}
      onClick={toggle}
    >
      <path
        className={classnames(styles.path)}
        d={pathData}
      />
      <circle
        cx={region.position.x}
        cy={region.position.y}
        r={radius}
        className={classnames(styles.regionCenter, {
          [styles.toggle]: region.size <= CITY_THRESHOLD,
        })}
      />
      <text
        x={region.position.x}
        y={region.position.y + TEXT_OFFSET_Y}
        textAnchor="middle"
        className={classnames(styles.label, {
          [styles.toggle]: region.size <= CITY_THRESHOLD,
        })}
      >
        {region.size > CITY_THRESHOLD ? region.name.toUpperCase() : region.name}
      </text>
    </g>
  );
}
