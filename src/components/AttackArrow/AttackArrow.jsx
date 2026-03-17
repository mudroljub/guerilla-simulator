import { useStore, useIsAttackable } from '../../store/store'

export default function AttackArrow({ color = '#cc5263', width = 3 }) {
  const { state: { regionDict, selected, selectedAttackingRegion } } = useStore()
  const attackable = useIsAttackable(selected?.name || '')

  if (!attackable || !selectedAttackingRegion) return null

  const start = regionDict[selectedAttackingRegion].position
  const end = selected.position
  const markerId = 'arrowhead'

  return (
    <g className="attack-arrow-group">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>

      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        style={{ opacity: 0.8 }}
      />
    </g>
  )
}