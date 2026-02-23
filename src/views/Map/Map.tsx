import React, { useRef, useState, useMemo, useReducer } from "react";
import { Delaunay } from "d3-delaunay";
import data from '../../data/gradovi-normalizovano.json';
import styles from './Map.module.scss';
import { Settlements, IRegion, Position } from '../../types/types';
import Region from '../../components/Region/Region';
import { State } from "../../store/states";
import { regionReducer, RegionStateMap } from "../../store/regionReducer";

const gradovi: Settlements = data;

interface ScrollPos {
  left: number;
  top: number;
}

const MAP_WIDTH = 2500;
const MAP_HEIGHT = 2500;

function buildInitialState(regions: IRegion[]): RegionStateMap {
  const m: RegionStateMap = {};
  for (const r of regions) m[r.name] = r.state;
  return m;
}

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 })

  // 1) baza (geometrija + početni random state)
  const regionsBase: IRegion[] = useMemo(() => {
    const objects = Object.entries(gradovi).map(([name, grad]) => ({
      name,
      size: grad.size,
      position: {
        x: grad.position.x * MAP_WIDTH,
        y: grad.position.y * MAP_HEIGHT,
      },
      state: grad.size < 0.1 && Math.random() < 0.1 ? State.Liberated : State.Occupied,
    }))

    const delaunay = Delaunay.from(objects.map(o => [o.position.x, o.position.y]));
    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);

    return objects
      .map((obj, i) => ({ ...obj, polygon: voronoi.cellPolygon(i) }))
      .filter(r => r.polygon) as IRegion[]
  }, [])

  // 2) inicijalno stanje za reducer (name -> state)
  const initialRegionState = useMemo(
    () => buildInitialState(regionsBase),
    [regionsBase]
  )

  // 3) centralizovano stanje (FSM store)
  const [regionState, dispatch] = useReducer(regionReducer, initialRegionState)

  // 4) ono što renderuješ: baza + trenutno stanje
  const regions: IRegion[] = useMemo(
    () => regionsBase.map(r => ({ ...r, state: regionState[r.name] ?? r.state })),
    [regionsBase, regionState]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartScroll({ left: containerRef.current.scrollLeft, top: containerRef.current.scrollTop })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return
    const dx = e.clientX - startPos.x
    const dy = e.clientY - startPos.y
    containerRef.current.scrollLeft = startScroll.left - dx
    containerRef.current.scrollTop = startScroll.top - dy
  }

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg width={MAP_WIDTH} height={MAP_HEIGHT} className={styles.svgMap}>
        {regions.map((region) => (
          <Region
            key={region.name}
            region={region}
            onClick={() => dispatch({ type: "TOGGLE_REGION", name: region.name })}
          />
        ))}
      </svg>
    </div>
  )
}