import classnames from 'classnames'
import { IRegion, Position } from '../../types/types';
import styles from './Region.module.scss';
import { State } from '../../fsm/states';

const MAX_RADIUS = 150;
const RADIUS_STEPS = [2, 4, 6, 8, 10];
const TEXT_OFFSET_Y = -10;
const labelThreshold = 0.01

interface Props {
  region: IRegion;
}

const stateStyle = {
  [State.Occupied]: styles.occupied,
  [State.Attacked]: styles.attacked,
  [State.Liberated]: styles.liberated,
}

function getPathData(polygon: [number, number][], center: Position): string {
  return polygon
    .map(([x, y], idx) => {
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance > MAX_RADIUS ? MAX_RADIUS / distance : 1;
      const nx = center.x + dx * scale;
      const ny = center.y + dy * scale;
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
    <g className={classnames(styles.region, stateStyle[region.state])}>
      <path d={pathData} />
      <circle
        cx={region.position.x}
        cy={region.position.y}
        r={getRadius(region.size)}
        className={styles.regionCenter}
      />
      <text
        x={region.position.x}
        y={region.position.y + TEXT_OFFSET_Y} 
        textAnchor="middle"
        className={classnames(styles.label, { [styles.hidden]: region.size <= labelThreshold })}
      >
        {region.name}
      </text>
    </g>
  )
}