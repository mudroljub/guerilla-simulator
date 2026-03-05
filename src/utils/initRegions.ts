import { Delaunay } from "d3-delaunay"
import { RegionData, Settlements } from "../types/types"
import data from "../data/gradovi-normalizovano.json"
import { MAP_SIZE } from "../config"

const gradovi: Settlements = data

function polygonArea(points: [number, number][]) {
  let area = 0
  const n = points.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i][0] * points[j][1] - points[j][0] * points[i][1]
  }
  return Math.abs(area) / 2
}

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

  const delaunay = Delaunay.from(regions.map((o) => [o.position.x, o.position.y]))
  const voronoi = delaunay.voronoi([0, 0, MAP_SIZE, MAP_SIZE])

  return regions
    .map((obj, i) => {
      const polygon = voronoi.cellPolygon(i)
      const neighbors = Array.from(delaunay.neighbors(i)).map((idx) => regions[idx].name)

      return polygon
        ? { 
            ...obj, 
            polygon, 
            area: polygonArea(polygon as [number, number][]),
            neighbors,
          }
        : null
    })
    .filter((r): r is RegionData & { area: number } => r !== null)
}