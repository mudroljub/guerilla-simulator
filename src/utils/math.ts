export const sample = <T, >(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const randomInRange = (from: number, to: number) => Math.random() * (to - from) + from

export const range = <T>(length: number, fn: (index: number) => T): T[] =>
  Array(length).fill(0).map((_, i) => fn(i))

export const roll = (): number => Math.floor(Math.random() * 6) + 1

export interface Point {
  x: number
  y: number
}
/**
 * Generiše SVG path string (Bezierova kriva) koji povezuje ishodište,
 * sve mete redom i vraća se nazad u ishodište praveći eliptični krug.
 */
export const getBombardmentPath = (source: Point, targets: Point[]): string => {
  if (targets.length === 0) return ''

  let path = `M ${source.x},${source.y}`

  const firstTarget = targets[0]
  const midX = (source.x + firstTarget.x) / 2
  const midY = (source.y + firstTarget.y) / 2 - 40
  path += ` Q ${midX},${midY} ${firstTarget.x},${firstTarget.y}`

  for (let i = 1; i < targets.length; i++) {
    const target = targets[i]
    path += ` T ${target.x},${target.y}`
  }

  path += ` T ${source.x},${source.y}`

  return path
}
