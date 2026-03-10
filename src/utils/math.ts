export const sample = <T, >(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const randomInRange = (from: number, to: number) => Math.random() * (to - from) + from

export const range = <T>(length: number, fn: (index: number) => T): T[] =>
  Array(length).fill(0).map((_, i) => fn(i))

export const roll = (): number => Math.floor(Math.random() * 6) + 1

export const getArcPath = (startX: number, startY: number, endX: number, endY: number) => {
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  const offset = 40
  const controlX = midX
  const controlY = midY - offset

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}
export interface Point {
  x: number
  y: number
}

/**
 * Generiše SVG path string (Bezierova kriva) koji povezuje izvor,
 * sve mete redom i vraća se nazad u izvor praveći eliptični krug.
 */
export const getBombardmentPath = (source: Point, targets: Point[]): string => {
  if (targets.length === 0) return ''

  let path = `M ${source.x},${source.y}`

  targets.forEach(target => {
    const midX = (source.x + target.x) / 2
    const midY = (source.y + target.y) / 2 - 40

    path += ` Q ${midX},${midY} ${target.x},${target.y}`
  })

  const lastTarget = targets[targets.length - 1]
  const returnMidX = (lastTarget.x + source.x) / 2
  const returnMidY = (lastTarget.y + source.y) / 2 + 40

  path += ` Q ${returnMidX},${returnMidY} ${source.x},${source.y}`

  return path
}
