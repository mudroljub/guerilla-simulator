import { useMemo } from "react";
import { CITY_LABEL_THRESHOLD } from '../../config';
import { useRegionStore } from '../../store/store';
import { Fraction, Garrison, RegionData, UnitType } from '../../types/types';
import { sample } from '../../utils/math';
import styles from "./Icon.module.scss";
import { nameToIcon, iconDict } from "./utils";

function getRandomUnitType(garrison: Garrison): UnitType {
  const units = (Object.keys(garrison) as UnitType[])
    .filter(unitType => (garrison[unitType] ?? 0) > 0)
  return Math.random() > 0.33 ? sample(units) : UnitType.infantry
}

interface Props {
  region: RegionData;
}

export default function Icon({ region }: Props) {
  const { regionDict } = useRegionStore();
  const { fraction, garrison } = regionDict[region.name];

  const unitType = useMemo<UnitType>(() => {
    return fraction === Fraction.German ? getRandomUnitType(garrison) : UnitType.infantry
  }, [fraction, garrison]);

  const SvgComponent = useMemo(() => {
    const icons = iconDict[fraction][unitType];
    if (!icons?.length) return null;
    return nameToIcon(icons, region.name);
  }, [fraction, unitType, region.name]);

  if ((fraction === Fraction.German  && region.size <= CITY_LABEL_THRESHOLD * 1.5)) return null;

  if (!SvgComponent) return null;

  return (
    <g transform={`translate(${region.position.x}, ${region.position.y})`}>
      <SvgComponent className={styles.icon} />
    </g>
  )
}