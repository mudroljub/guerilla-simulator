import { Delaunay } from "d3-delaunay";
import { IRegion, Status, Settlements } from "../../types/types";

export const initRegions = (gradovi: Settlements, mapSize: number) => {
  const regions = Object.entries(gradovi).map(([name, grad]) => ({
    name,
    size: grad.size,
    position: {
      x: grad.position.x * mapSize,
      y: grad.position.y * mapSize,
    },
    status: grad.size < 0.1 && Math.random() < 0.1
        ? Status.Liberated
        : Status.Occupied,
  }))

  const delaunay = Delaunay.from(regions.map((o) => [o.position.x, o.position.y]));
  const voronoi = delaunay.voronoi([0, 0, mapSize, mapSize]);

  return regions
    .map((obj, i) => ({ ...obj, polygon: voronoi.cellPolygon(i) }))
    .filter((r) => r.polygon) as IRegion[]
}