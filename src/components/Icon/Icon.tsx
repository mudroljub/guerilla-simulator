import { useMemo } from "react";
import { CITY_LABEL_THRESHOLD } from '../../config';
import { useRegionStore } from '../../store/store';
import { Garrison, RegionData, UnitType } from '../../types/types';
import { sample } from '../../utils/math';
import styles from "./Icon.module.scss";
import { iconDict } from "./utils";

function getRandomUnit(garrison: Garrison): UnitType {
  const units = (Object.keys(garrison) as UnitType[]).filter(unit => garrison[unit] > 0);
  return units.length ? sample(units) : "infantry";
}

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  const { regionDict } = useRegionStore();
  const regionState = regionDict[region.name];

  const SvgComponent = useMemo(() => {
    if (!regionState) return null;

    const unitType: UnitType = regionState.fraction === 'German' 
      ? getRandomUnit(regionState.garrison) 
      : 'infantry';

    const factionDict = iconDict[regionState.fraction];
    const iconsArray = factionDict ? factionDict[unitType] : null;
    
    return Array.isArray(iconsArray) 
      ? sample(iconsArray) 
      : null;
  }, [regionState.garrison, regionState.fraction]);

  if (region.size <= CITY_LABEL_THRESHOLD || !SvgComponent) return null;

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}>
      <SvgComponent className={styles.icon} width="100" height="100" />
    </g>
  );
}