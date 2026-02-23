import React, { useRef, useState, useMemo } from "react";
import { Delaunay } from "d3-delaunay";
import data from "../../data/gradovi-normalizovano.json";
import styles from "./Map.module.scss";
import { Settlements, IRegion, Position, RegionState } from "../../types/types";
import Region from "../../components/Region/Region";
import { MapProvider } from "../../store/mapStore";
import { SFRJ_D, SFRJ_D_ADRIA } from "./paths";

const gradovi: Settlements = data;

interface ScrollPos {
  left: number;
  top: number;
}

const MAP_WIDTH = 2500;
const MAP_HEIGHT = 2500;

// Original SFRJ SVG viewBox
const SFRJ_W = 1219.65;
const SFRJ_H = 1057.485;

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 });

  const regionsBase: IRegion[] = useMemo(() => {
    const objects = Object.entries(gradovi).map(([name, grad]) => ({
      name,
      size: grad.size,
      position: {
        x: grad.position.x * MAP_WIDTH,
        y: grad.position.y * MAP_HEIGHT,
      },
      initialState:
        grad.size < 0.1 && Math.random() < 0.1
          ? RegionState.Liberated
          : RegionState.Occupied,
    }));

    const delaunay = Delaunay.from(
      objects.map((o) => [o.position.x, o.position.y])
    );

    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);

    return objects
      .map((obj, i) => ({ ...obj, polygon: voronoi.cellPolygon(i) }))
      .filter((r) => r.polygon) as IRegion[];
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartScroll({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    containerRef.current.scrollLeft = startScroll.left - dx;
    containerRef.current.scrollTop = startScroll.top - dy;
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <MapProvider regionsBase={regionsBase}>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className={styles.svgMap}
        >
          <defs>
            <clipPath id="clip-sfrj" clipPathUnits="userSpaceOnUse">
              <path
                d={SFRJ_D}
                transform={`scale(${MAP_WIDTH / SFRJ_W} ${MAP_HEIGHT / SFRJ_H})`}
              />
            </clipPath>
            <pattern
              id="liberatedPattern"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="#ccd1be" />
              <circle cx="4" cy="4" r="3" fill="#cc5263" />
            </pattern>
          </defs>

          <path
            d={SFRJ_D_ADRIA}
            fill="#c0cac2"
            transform={`scale(${MAP_WIDTH / SFRJ_W} ${MAP_HEIGHT / SFRJ_H})`}
          />

          <g clipPath="url(#clip-sfrj)">
            {regionsBase.map((region) => (
              <Region key={region.name} region={region} />
            ))}
          </g>
        </svg>
      </div>
    </MapProvider>
  );
}