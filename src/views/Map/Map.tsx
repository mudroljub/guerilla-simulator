import React, { useRef, useState, useMemo } from "react";
import { Delaunay } from "d3-delaunay";
import gradoviJSON from '../../data/gradovi_normalizovano.json';
import styles from './Map.module.scss';
import { Settlement, Settlements } from '../../types/settlements';

const gradovi: Settlements = gradoviJSON;

interface DragPos {
  x: number;
  y: number;
}

interface ScrollPos {
  left: number;
  top: number;
}

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<DragPos>({ x: 0, y: 0 });
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartScroll({ left: containerRef.current.scrollLeft, top: containerRef.current.scrollTop });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    containerRef.current.scrollLeft = startScroll.left - dx;
    containerRef.current.scrollTop = startScroll.top - dy;
  };

  const handleMouseUp = () => setDragging(false);

  const points = useMemo(() =>
    Object.values(gradovi).map(g => [g.position.x * MAP_WIDTH, g.position.y * MAP_HEIGHT] as [number, number])
    , []);

  const delaunay = useMemo(() => Delaunay.from(points), [points]);
  const voronoi = useMemo(() => delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]), [delaunay]);

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.map}>
        <svg width={MAP_WIDTH} height={MAP_HEIGHT} style={{ position: 'absolute', top: 0, left: 0 }}>
          {points.map((_, i) => {
            const polygon = voronoi.cellPolygon(i);
            if (!polygon) return null;
            const pathData = polygon.map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z';
            return <path key={i} d={pathData} fill="none" stroke="black" strokeWidth={1} />;
          })}
        </svg>

        {Object.entries(gradovi).map(([naziv, grad]: [string, Settlement]) =>
          <div
            key={naziv}
            className={styles.grad}
            style={{
              top: `${grad.position.y * 100}%`,
              left: `${grad.position.x * 100}%`
            }}
          >
            {naziv}
          </div>
        )}
      </div>
    </div>
  );
}