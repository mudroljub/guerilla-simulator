import { IRegion } from '../../types/types';

const MAX_RADIUS = 200;

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

export default function Region({ region }: Props) {
  const pathData = getPathData(region.polygon, region.position);
  return (
    <g>
      <path d={pathData} fill="none" stroke="black" strokeWidth={1} />
      <text
        x={region.position[0]}
        y={region.position[1]}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{ fontSize: 14, pointerEvents: 'none' }}
      >
        {region.name}
      </text>
    </g>
  );
}