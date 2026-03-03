import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction } from "./mapReducer";
import { Fraction, MapState, RegionData, RegionDict, RegionState, RegionStateDerived } from "../types/types";
import { initRegionState } from "../utils/initRegionState";

interface Store {
  state: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<Store | undefined>(undefined);

const initialState = (regions: RegionData[]): MapState => {
  const regionDict: RegionDict = {}
  for (const region of regions) {
    regionDict[region.name] = initRegionState(region)
  }
  return { selected: null, regionDict }
}

export function Provider({ regions, children }: { regions: RegionData[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, regions, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useStore must be used within MapProvider");
  return ctx;
};

const getPartisanNeighbors = (neighbors: string[], dict: RegionDict) =>
    neighbors.filter(neighbor => dict[neighbor].fraction === Fraction.Partisan && dict[neighbor].garrison.infantry > 0)

export const useRegionStateDerived = (region: RegionState): RegionStateDerived => {
  const { state: { selected, regionDict } } = useStore()

  return useMemo(() => {
    const partisanNeighbors = getPartisanNeighbors(region.neighbors, regionDict)

    const attackable = selected?.name === region.name
      && selected.fraction === Fraction.German 
      && getPartisanNeighbors(selected.neighbors, regionDict).length > 0

    return { 
      partisanNeighbors,
      attackable,
    };
  }, [region.name, region.neighbors, regionDict, selected])
}
