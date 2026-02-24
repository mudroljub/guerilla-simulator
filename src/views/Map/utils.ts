import { Delaunay } from "d3-delaunay";
import { IRegion, Settlements } from "../../types/types";
import data from "../../data/gradovi-normalizovano.json";
import { MAP_SIZE } from "../../config";

const gradovi: Settlements = data;

export const initRegions = () => {
  const regions = Object.entries(gradovi).map(([name, grad]) => ({
    name,
    size: grad.size,
    position: {
      x: grad.position.x * MAP_SIZE,
      y: grad.position.y * MAP_SIZE,
    },
  }))

  const delaunay = Delaunay.from(regions.map((o) => [o.position.x, o.position.y]));
  const voronoi = delaunay.voronoi([0, 0, MAP_SIZE, MAP_SIZE]);

  return regions
    .map((obj, i) => ({ ...obj, polygon: voronoi.cellPolygon(i) }))
    .filter((r) => r.polygon) as IRegion[]
}