import { IRegion } from '../../types/types';
import styles from './Region.module.scss';

const MAX_RADIUS = 150;

interface Props {
  region: IRegion;
}

const CIRCLE_SIZES = [2, 4, 6, 8, 10];

export function getRadius(normalizedSize: number): number {
  const biased = Math.pow(normalizedSize, 0.3) // faktor nagnutosti
  const index = Math.floor(biased * CIRCLE_SIZES.length)
  return CIRCLE_SIZES[Math.min(index, CIRCLE_SIZES.length - 1)]
}

function getPathData(polygon: [number, number][], center: [number, number]): string {
  return polygon
    .map(([x, y], idx) => {
      const dx = x - center[0];
      const dy = y - center[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance > MAX_RADIUS ? MAX_RADIUS / distance : 1;
      const nx = center[0] + dx * scale;
      const ny = center[1] + dy * scale;
      return `${idx === 0 ? 'M' : 'L'}${nx},${ny}`;
    })
    .join(' ') + ' Z';
}

export default function Region({ region }: Props) {
  const pathData = getPathData(region.polygon, region.position);

  return (
    <g className={styles.region}>
      <path
        d={pathData}
        className={styles.regionShape}
      />
      <circle
        cx={region.position[0]}
        cy={region.position[1]}
        r={getRadius(region.size)}
        className={styles.regionCenter}
      />
      {region.size > 0.01 && (
        <text
          x={region.position[0]}
          y={region.position[1]}
          textAnchor="middle"
          alignmentBaseline="middle"
          className={styles.regionLabel}
        >
          {region.name}
        </text>
      )}
    </g>
  );
}