import { Delaunay } from "d3-delaunay";
import { RegionData, Settlements } from "../types/types";
import data from "../data/gradovi-normalizovano.json";
import { MAP_SIZE } from "../config";

const gradovi: Settlements = data;

export const initRegions = (): RegionData[] => {
  const regions = Object.entries(gradovi)
    .map(([name, grad]) => ({
      name,
      size: grad.size,
      population: grad.population,
      position: {
        x: grad.position.x * MAP_SIZE,
        y: grad.position.y * MAP_SIZE,
      },
    }))
    .sort((a, b) => a.size - b.size)

  const delaunay = Delaunay.from(regions.map((o) => [o.position.x, o.position.y]));
  const voronoi = delaunay.voronoi([0, 0, MAP_SIZE, MAP_SIZE]);

  return regions
    .map((obj, i) => ({ ...obj, polygon: voronoi.cellPolygon(i) }))
    .filter((r) => r.polygon) as RegionData[]
}