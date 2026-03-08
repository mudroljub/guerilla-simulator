import styles from './Map.module.scss'
import Region from '../Region/Region'
import { SFRJ_D, SFRJ_D_ADRIA } from '../../data/paths'
import { MAP_SIZE } from '../../config'
import { useStore } from '../../store/store'
import UnitIcon from '../Unit/UnitIcon'
import { mapDict } from '../Unit/data'

const viewBox_w = 1219.65 // from svg
const viewBox_h = 1057.485
const SCALE_X = MAP_SIZE / viewBox_w
const SCALE_Y = MAP_SIZE / viewBox_h

export default function Map() {
  const { state: { regionDict } } = useStore()
  const regions = Object.values(regionDict)

  return (
    <svg
      width={MAP_SIZE}
      height={MAP_SIZE}
      viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
      className={styles.svgMap}
    >
      <defs>
        <pattern
          id="liberatedPattern"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="#ccd1be" />
          <circle cx="4" cy="4" r="3" fill="#cc5263" />
        </pattern>

        <mask id="mask-land" maskUnits="userSpaceOnUse">
          <path
            d={SFRJ_D}
            fill="white"
            transform={`scale(${SCALE_X} ${SCALE_Y})`}
          />

          <path
            d={SFRJ_D_ADRIA}
            fill="black"
            transform={`scale(${SCALE_X} ${SCALE_Y})`}
          />
        </mask>
      </defs>

      <path
        d={SFRJ_D_ADRIA}
        fill="#bcc8be"
        transform={`scale(${SCALE_X} ${SCALE_Y})`}
      />

      <path
        d={SFRJ_D}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={1}
        pointerEvents="none"
        transform={`scale(${SCALE_X} ${SCALE_Y})`}
      />

      <g mask="url(#mask-land)">
        {regions.map(region => <Region key={region.name} region={region} />)}
      </g>

      {regions
        .slice()
        .sort((a, b) => b.area - a.area)
        .map((r, i) => i < regions.length * 0.5 && <UnitIcon key={r.name} id={r.name} region={r} iconDict={mapDict} />)
      }
    </svg>
  )
}