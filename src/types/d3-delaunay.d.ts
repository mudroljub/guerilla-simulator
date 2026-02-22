declare module 'd3-delaunay' {
  export class Delaunay {
    static from(points: Array<[number, number]>): Delaunay;
    voronoi(bounds: [number, number, number, number]): Voronoi;
    cellPolygon(i: number): [number, number][] | null;
  }

  export interface Voronoi {
    cellPolygon(i: number): [number, number][] | null;
  }
}