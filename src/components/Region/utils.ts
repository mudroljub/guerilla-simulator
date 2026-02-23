import { Position } from "../../types/types";

const RADIUS_STEPS = [2, 4, 6, 8, 10];

export function getPathData(
  polygon: [number, number][],
  center: Position,
): string {
  return (
    polygon
      .map(([x, y], idx) => {
        const dx = x - center.x;
        const dy = y - center.y;
        const nx = center.x + dx;
        const ny = center.y + dy;
        return `${idx === 0 ? "M" : "L"}${nx},${ny}`;
      })
      .join(" ") + " Z"
  );
}

export function getRadius(normalizedSize: number): number {
  const biased = Math.pow(normalizedSize, 0.3);
  const index = Math.floor(biased * RADIUS_STEPS.length);
  return RADIUS_STEPS[Math.min(index, RADIUS_STEPS.length - 1)];
}
