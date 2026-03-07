import React, { ReactNode, useRef, useState } from 'react'
import styles from './Map.module.scss'
import { GamePhase, Position } from '../../types/types'
import { useStore } from '../../store/store';

interface ScrollPos {
  left: number;
  top: number;
}

interface Props {
    children: ReactNode;
}

export const message: Record<GamePhase, string> = {
  [GamePhase.ATTACK_PHASE]: 'Move troops into enemy territory.',
  [GamePhase.COMBAT_PHASE]: 'Battles are in progress...',
  [GamePhase.MOBILIZATION]: 'Deploy new units to your territories.',
  [GamePhase.BOMBARDMENT]: 'Enemy planes are bombing our towns',
}

export default function MapContainer({ children }: Props) {
  const { state: { phase } } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartScroll({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return
    const dx = e.clientX - startPos.x
    const dy = e.clientY - startPos.y
    containerRef.current.scrollLeft = startScroll.left - dx
    containerRef.current.scrollTop = startScroll.top - dy
  }

  const handleMouseUp = () => setDragging(false)

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
      <p className={styles.title}>{message[phase]}</p>
    </div>
  )
}