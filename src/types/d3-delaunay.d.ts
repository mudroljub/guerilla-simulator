declare module 'd3-delaunay' {
  export class Delaunay {
    static from(points: ArrayLike<[number, number]>): Delaunay;
    neighbors(i: number): Generator<number, void, unknown>;
    voronoi(bounds: [number, number, number, number]): Voronoi;
    readonly points: Float64Array;
    readonly triangles: Int32Array;
    readonly halfedges: Int32Array;
  }

  export interface Voronoi {
    cellPolygon(i: number): [number, number][] | null;
    readonly delaunay: Delaunay;
    readonly xmin: number;
    readonly ymin: number;
    readonly xmax: number;
    readonly ymax: number;
  }
}