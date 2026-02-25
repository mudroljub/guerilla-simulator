import { CITY_LABEL_THRESHOLD } from '../../config';
import { useRegionStore } from '../../store/store';
import { RegionData } from '../../types/types';
import styles from "./Icon.module.scss";
import { ReactComponent as Svg } from '../../assets/images/german/infantry/komandir-02.svg';

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  const { regionDict } = useRegionStore();
  const regionState = regionDict[region.name]
  console.log(regionState.fraction)
  
  if (region.size <= CITY_LABEL_THRESHOLD) return null;

  return (
    <g key={region.name} transform={`translate(${region.position.x}, ${region.position.y})`}>
      <Svg className={styles.icon} />
    </g>
  );
}