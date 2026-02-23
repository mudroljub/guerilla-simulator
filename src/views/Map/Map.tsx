import React, { useRef, useState } from "react";
import data from "../../data/gradovi-normalizovano.json";
import styles from "./Map.module.scss";
import { Settlements, IRegion, Position } from "../../types/types";
import Region from "../../components/Region/Region";
import { MapProvider } from "../../store/mapStore";
import { SFRJ_D, SFRJ_D_ADRIA } from "./paths";
import { initRegions } from "./utils";

const gradovi: Settlements = data;

interface ScrollPos {
  left: number;
  top: number;
}

const MAP_SIZE = window.innerWidth * 1.5;
// original viewBox iz svg
const SFRJ_W = 1219.65;
const SFRJ_H = 1057.485;
const SCALE_X = MAP_SIZE / SFRJ_W
const SCALE_Y = MAP_SIZE / SFRJ_H

const regions: IRegion[] = initRegions(gradovi, MAP_SIZE)

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 });

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
    <MapProvider regionsBase={regions}>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
            {regions.map((region) => (
              <Region key={region.name} region={region} />
            ))}
          </g>
        </svg>
      </div>
    </MapProvider>
  );
}