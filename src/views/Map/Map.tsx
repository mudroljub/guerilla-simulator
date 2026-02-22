import React, { useRef, useState, useMemo } from "react";
import { Delaunay } from "d3-delaunay";
import gradoviJSON from '../../data/gradovi_normalizovano.json';
import styles from './Map.module.scss';
import { Settlements, IRegion } from '../../types/settlements';
import Region from '../../components/Region/Region';

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
const MAX_RADIUS = 200;

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

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<DragPos>({ x: 0, y: 0 });
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 });

  const regions: IRegion[] = useMemo(() => {
    const objects = Object.entries(gradovi).map(([name, grad]) => ({
      name,
      position: [grad.position.x * MAP_WIDTH, grad.position.y * MAP_HEIGHT] as [number, number]
    }));

    const delaunay = Delaunay.from(objects.map(o => o.position));
    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);

    return objects
      .map((obj, i) => {
        const polygon = voronoi.cellPolygon(i);
        if (!polygon) return null;
        return { ...obj, polygon };
      })
      .filter(Boolean) as IRegion[];
  }, []);

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
          {regions.map((region, i) => {
            const pathData = getPathData(region.polygon!, region.position);
            return <Region key={i} pathData={pathData} region={region} />;
          })}
        </svg>
      </div>
    </div>
  );
}