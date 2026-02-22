import React, { useRef, useState } from "react";
import data from '../../data/gradovi_normalizovano.json';
import styles from './Map.module.scss';
import { Settlement, Settlements } from '../../types';

const gradovi: Settlements = data;

interface DragPos {
  x: number;
  y: number;
}

interface ScrollPos {
  left: number;
  top: number;
}

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
        {Object.entries(gradovi).map(([key, grad]: [string, Settlement]) =>
          <div
            key={key}
            className={styles.grad}
            style={{
              top: `${grad.position.y * 100}%`,
              left: `${grad.position.x * 100}%`
            }}
          >
            {key}
          </div>
        )}
      </div>
    </div>
  )
}