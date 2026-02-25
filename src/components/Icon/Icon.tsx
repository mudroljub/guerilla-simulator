import { CITY_LABEL_THRESHOLD } from '../../config';
import { useRegionStore } from '../../store/store';
import { Fraction, Garrison, RegionData, UnitType } from '../../types/types';
import styles from "./Icon.module.scss";
import React, { useEffect, useState } from "react";

function getRarestUnit(garrison: Garrison): UnitType {
  if (garrison.aircraft > 0) return "aircraft";
  if (garrison.tanks > 0) return "tanks";
  if (garrison.artillery > 0) return "artillery";
  return "infantry";
}
const icons: Record<Fraction, Partial<Record<UnitType, () => Promise<any>>>> = {
  German: {
    infantry: () => import('../../assets/images/german/infantry/komandir-02.svg'),
    tanks: () => import('../../assets/images/german/tanks/stug3-a.svg'),
    artillery: () => import('../../assets/images/german/artillery/artiljerija-01.svg'),
    aircraft: () => import('../../assets/images/german/aircraft/avion-odozgo-01.svg'),
  },
  Italian: {
    infantry: () => import('../../assets/images/partisan/infantry/bombas-02.svg'),
  },
  Partisan: {
    infantry: () => import('../../assets/images/partisan/infantry/bombas-02.svg'),
  }
};

export const getIcon = (garrison: Garrison, fraction: Fraction) => {
  const unitType: UnitType = fraction === 'German' 
    ? getRarestUnit(garrison) 
    : 'infantry';

  return icons[fraction][unitType];
};

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  const { regionDict } = useRegionStore();
  const regionState = regionDict[region.name];

  const [Svg, setSvg] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const iconPath = getIcon(regionState.garrison, regionState.fraction)
    console.log(iconPath);

    const importer = getIcon(regionState.garrison, regionState.fraction);
    if (importer) {
      importer().then(mod => setSvg(() => mod.ReactComponent));
    }
  }, []);

  if (region.size <= CITY_LABEL_THRESHOLD || !Svg) return null;

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}> <Svg className={styles.icon} /> </g>
  );
}
