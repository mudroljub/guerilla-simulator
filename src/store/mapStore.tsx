import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction, MapState } from "./mapReducer";
import { IRegion } from "../types/types";

interface MapStore {
  regions: IRegion[];
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<MapStore | undefined>(undefined);

const initialState = (regions: IRegion[]): MapState =>
  regions.reduce((acc, r) => ({ ...acc, [r.name]: r.initialState }), {});

export function MapProvider({ regions, children }: { regions: IRegion[]; children: ReactNode }) {
  const [mapState, dispatch] = useReducer(mapReducer, regions, initialState);

  const value = useMemo(() => ({ regions, mapState, dispatch }), [regions, mapState]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useMapStore = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapStore must be used within MapProvider");
  return ctx;
};