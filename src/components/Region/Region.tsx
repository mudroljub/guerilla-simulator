import { IRegion } from '../../types/types';
import styles from './Region.module.scss';

const MAX_RADIUS = 150;
const RADIUS_STEPS = [2, 4, 6, 8, 10];
const TEXT_OFFSET_Y = -10;

interface Props {
  region: IRegion;
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

function getRadius(normalizedSize: number): number {
  const biased = Math.pow(normalizedSize, 0.3);
  const index = Math.floor(biased * RADIUS_STEPS.length);
  return RADIUS_STEPS[Math.min(index, RADIUS_STEPS.length - 1)];
}

export default function Region({ region }: Props) {
  const pathData = getPathData(region.polygon, region.position);

  return (
    <g className={styles.region} style={{ overflow: 'visible' }}>
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
          y={region.position[1] + TEXT_OFFSET_Y} 
          textAnchor="middle"
          className={styles.regionLabel}
        >
          {region.name}
        </text>
      )}
    </g>
  );
}