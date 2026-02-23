import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction, MapState } from "./mapReducer";
import { IRegion, RegionState } from "../types/types";

interface Store {
  regions: IRegion[];
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<Store | undefined>(undefined);

const initialState = (regions: IRegion[]): MapState => ({
  regions: regions.reduce((acc, r) => {
    acc[r.name] = {
      status: r.status,
      garrison: 0,
      fraction: "German",
    };
    return acc;
  }, {} as Record<string, RegionState>),
  selected: null,
});

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