import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction } from "./mapReducer";
import { MapState, RegionData, RegionsState, Status } from "../types/types";

interface Store {
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<Store | undefined>(undefined);

const initialState = (regions: RegionData[]): MapState => ({
  regionDict: regions.reduce((acc, r) => ({
    ...acc,
    [r.name]: {
      status: r.size < 0.1 && Math.random() < 0.1
        ? Status.Liberated
        : Status.Occupied,
      garrison: 0,
      fraction: "German",
    }
  }), {} as RegionsState),
  selected: null,
});

export function MapProvider({ regions, children }: { regions: RegionData[]; children: ReactNode }) {
  const [mapState, dispatch] = useReducer(mapReducer, regions, initialState);

  const value = useMemo(() => ({ mapState, dispatch }), [mapState]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useStore must be used within MapProvider");
  return ctx;
};