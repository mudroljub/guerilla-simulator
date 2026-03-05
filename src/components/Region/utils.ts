const RADIUS_STEPS = [2, 4, 6, 8, 10]

export const getPathData = (polygon: [number, number][]): string =>
  polygon.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ") + " Z"

export function getRadius(normalizedSize: number): number {
  const biased = Math.pow(normalizedSize, 0.3)
  const index = Math.floor(biased * RADIUS_STEPS.length)
  return RADIUS_STEPS[Math.min(index, RADIUS_STEPS.length - 1)]
}
