import { IRegion } from '../../types/settlements';

interface Props {
  pathData: string;
  region: IRegion;
}

export default function Region({ pathData, region }: Props) {
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