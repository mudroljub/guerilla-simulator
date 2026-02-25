import { ReactComponent as Svg } from '../../assets/images/germans/infantry/komandir-02.svg';
import { CITY_LABEL_THRESHOLD } from '../../config';
import { RegionData } from '../../types/types';
import styles from "./Icon.module.scss";

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  if (region.size <= CITY_LABEL_THRESHOLD) return null

  return (
    <g key={region.name} transform={`translate(${region.position.x}, ${region.position.y})`}>
      <Svg className={styles.icon} />
    </g>
  )
}