import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Map.module.scss'
import { Position } from '../../types/types'
import { useStore } from '../../store/store'

interface ScrollPos {
  left: number;
  top: number;
}

interface Props {
    children: ReactNode;
}

export default function MapContainer({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 })
  const { state } = useStore()
  const { bombings, currentBombardmentIndex, phase } = state

  useEffect(() => {
    if (phase === 'BOMBING_PHASE' && bombings[currentBombardmentIndex ?? 0]) {
      const currentEvent = bombings[currentBombardmentIndex ?? 0]
      const targetId = currentEvent.targets[0]?.regionName
      const targetRegion = state.regionDict[targetId]

      if (targetRegion && containerRef.current) {
        const container = containerRef.current

        const regionX = targetRegion.position.x
        const regionY = targetRegion.position.y

        const { clientWidth } = container
        const { clientHeight } = container

        const targetScrollLeft = regionX - clientWidth / 2
        const targetScrollTop = regionY - clientHeight / 2

        container.scrollTo({
          left: targetScrollLeft,
          top: targetScrollTop,
          behavior: 'smooth'
        })
      }
    }
  }, [phase, currentBombardmentIndex, bombings, state.regionDict])

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
    </div>
  )
}