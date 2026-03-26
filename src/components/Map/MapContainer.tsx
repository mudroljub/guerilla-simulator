import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Map.module.scss'
import { Position, GamePhase } from '../../types/types'
import { useStore } from '../../store/store'

interface ScrollPos {
  left: number
  top: number
}

interface Props {
    children: ReactNode
}

export default function MapContainer({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [startScroll, setStartScroll] = useState<ScrollPos>({ left: 0, top: 0 })
  const { state } = useStore()
  const { bombings, bombingIndex, phase, offensiveAttacks, offensiveAnimationIndex, regionDict } = state

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let targetX = 0
    let targetY = 0
    let shouldScroll = false

    if (phase === GamePhase.BOMBING_PHASE && bombings[bombingIndex ?? 0]) {
      const currentEvent = bombings[bombingIndex ?? 0]
      const targetId = currentEvent.targets[0]?.regionName
      const targetRegion = regionDict[targetId]
      if (targetRegion) {
        targetX = targetRegion.position.x
        targetY = targetRegion.position.y
        shouldScroll = true
      }
    }

    if (phase === GamePhase.ENEMY_OFFENSIVE && offensiveAttacks[offensiveAnimationIndex ?? 0]) {
      const currentAttack = offensiveAttacks[offensiveAnimationIndex ?? 0]
      const targetRegion = regionDict[currentAttack.targetRegion]
      if (targetRegion) {
        targetX = targetRegion.position.x
        targetY = targetRegion.position.y
        shouldScroll = true
      }
    }

    if (shouldScroll) {
      const { clientWidth, clientHeight } = container
      container.scrollTo({
        left: targetX - clientWidth / 2,
        top: targetY - clientHeight / 2,
        behavior: 'smooth'
      })
    }
  }, [phase, bombingIndex, bombings, offensiveAnimationIndex, offensiveAttacks, regionDict])

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