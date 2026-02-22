interface Props {
  pathData: string;
  point: [number, number];
  name: string;
}

export default function Region({ pathData, point, name }: Props) {
  return (
    <g>
      <path d={pathData} fill="none" stroke="black" strokeWidth={1} />
      <text
        x={point[0]}
        y={point[1]}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{ fontSize: 14, pointerEvents: 'none' }}
      >
        {name}
      </text>
    </g>
  );
}