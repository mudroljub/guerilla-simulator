import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction } from "./mapReducer";
import { MapState, RegionData, RegionDict, RegionState, Status } from "../types/types";
import { generateGarrison } from "../utils/generateGarrison";

interface Store {
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<Store | undefined>(undefined);

const initRegionState = (region: RegionData) : RegionState => {
    const status = region.size < 0.1 && Math.random() < 0.1
        ? Status.Liberated
        : Status.Occupied

    return {
      status,
      garrison: generateGarrison(region.population),
      fraction: status === Status.Liberated ? "Partisan" : "German",
    }
}

const initialState = (regions: RegionData[]): MapState => ({
  selected: null,
  regionDict: regions.reduce((dict, region) => ({
    ...dict,
    [region.name]: initRegionState(region),
  }), {} as RegionDict),
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