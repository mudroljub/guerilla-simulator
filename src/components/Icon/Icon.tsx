import { CITY_LABEL_THRESHOLD } from '../../config';
import { useRegionStore } from '../../store/store';
import { Fraction, Garrison, RegionData, UnitType } from '../../types/types';
import { sample } from '../../utils/math';
import styles from "./Icon.module.scss";
import React, { useEffect, useMemo, useState } from "react";

function getRandomUnit(garrison: Garrison): UnitType {
  const units = (Object.keys(garrison) as UnitType[])
    .filter(unit => garrison[unit] > 0);

  return (units.length) ? sample(units) : "infantry"
}

type SvgLoader = () => Promise<any>;

const imports: Record<Fraction, Partial<Record<UnitType, SvgLoader[]>>> = {
  German: {
    infantry: [
      () => import('../../assets/images/german/infantry/komandir-02.svg'),
      () => import('../../assets/images/german/infantry/mitraljezac-09.svg'),
      () => import('../../assets/images/german/infantry/mitraljezac-10.svg'),
      () => import('../../assets/images/german/infantry/narednik-01.svg'),
      () => import('../../assets/images/german/infantry/narednik-02.svg'),
      () => import('../../assets/images/german/infantry/specijalac-02.svg'),
      () => import('../../assets/images/german/infantry/ss-07.svg'),
      () => import('../../assets/images/german/infantry/ss-08.svg'),
      () => import('../../assets/images/german/infantry/ss-10.svg'),
      () => import('../../assets/images/german/infantry/strazar-01-sledja.svg'),
      () => import('../../assets/images/german/infantry/vojnik-16.svg'),
    ],
    tanks: [
      () => import('../../assets/images/german/tanks/jagdpanzer38.svg'),
      () => import('../../assets/images/german/tanks/lefh18-01.svg'),
      () => import('../../assets/images/german/tanks/panzer1a-02.svg'),
      () => import('../../assets/images/german/tanks/sd-kfz121.svg'),
      () => import('../../assets/images/german/tanks/sd-kfz161-02.svg'),
      () => import('../../assets/images/german/tanks/sd-kfz161.svg'),
      () => import('../../assets/images/german/tanks/somua-s35.svg'),
      () => import('../../assets/images/german/tanks/stug3-a.svg'),
    ],
    artillery: [
      () => import('../../assets/images/german/artillery/artiljerija-01.svg'),
      () => import('../../assets/images/german/artillery/fh18-150mm.svg'),
      () => import('../../assets/images/german/artillery/gebg36.svg'),
    ],
    aircraft: [
      () => import('../../assets/images/german/aircraft/dornier-do-355-01.svg'),
      () => import('../../assets/images/german/aircraft/fieseler-fi-156.svg'),
      () => import('../../assets/images/german/aircraft/junkers-ju87b-stuka.svg'),
      () => import('../../assets/images/german/aircraft/junkers-ju87d-5.svg'),
      () => import('../../assets/images/german/aircraft/junkers-ju87d-stuka-03.svg'),
      () => import('../../assets/images/german/aircraft/junkers-ju87d-stuka.svg'),
      () => import('../../assets/images/german/aircraft/Mesersmit-Bf-109e.svg'),
      () => import('../../assets/images/german/aircraft/Messerschmitt-Bf-109.svg'),
    ],
  },
  Italian: {
    infantry: [
      () => import('../../assets/images/partisan/infantry/bombas-02.svg'),
    ],
  },
  Partisan: {
    infantry: [
      () => import('../../assets/images/partisan/infantry/bombas-02.svg'),
      () => import('../../assets/images/partisan/infantry/bombas-04.svg'),
      () => import('../../assets/images/partisan/infantry/komunist-02.svg'),
      () => import('../../assets/images/partisan/infantry/mitraljezac-02.svg'),
      () => import('../../assets/images/partisan/infantry/partizan-bombas-sledja.svg'),
      () => import('../../assets/images/partisan/infantry/partizanka-01.svg'),
      () => import('../../assets/images/partisan/infantry/partizanka-02.svg'),
      () => import('../../assets/images/partisan/infantry/partizanka-03.svg'),
      () => import('../../assets/images/partisan/infantry/pokret-02.svg'),
      () => import('../../assets/images/partisan/infantry/pokret-04.svg'),
      () => import('../../assets/images/partisan/infantry/pokret-05.svg'),
      () => import('../../assets/images/partisan/infantry/pokret-06.svg'),
      () => import('../../assets/images/partisan/infantry/ranjenica-01.svg'),
      () => import('../../assets/images/partisan/infantry/spanac-02.svg'),
      () => import('../../assets/images/partisan/infantry/sten-06-sledja.svg'),
      () => import('../../assets/images/partisan/infantry/stoji-01.svg'),
      () => import('../../assets/images/partisan/infantry/stoji-02.svg'),
      () => import('../../assets/images/partisan/infantry/stoji-03.svg'),
      () => import('../../assets/images/partisan/infantry/vojnik-01.svg'),
      () => import('../../assets/images/partisan/infantry/vojnik-03.svg'),
    ],
  },
};

export const importIcon = (garrison: Garrison, fraction: Fraction) => {
  const unitType: UnitType = fraction === 'German' 
    ? getRandomUnit(garrison) 
    : 'infantry';

  const value = imports[fraction][unitType]
  return Array.isArray(value) ? sample(value) : value
};

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  const { regionDict } = useRegionStore();
  const regionState = regionDict[region.name];

  const [Svg, setSvg] = useState<React.ComponentType<any> | null>(null);

  const importer = useMemo(
    () => importIcon(regionState.garrison, regionState.fraction),
    [regionState.garrison, regionState.fraction]
  );

  useEffect(() => {
    if (importer) {
      importer().then(mod => setSvg(() => mod.ReactComponent));
    }
  }, [importer]);

  if (region.size <= CITY_LABEL_THRESHOLD || !Svg) return null;

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}>
      <Svg className={styles.icon} width="100" height="100" />
    </g>
  )
}
