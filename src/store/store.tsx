import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction } from "./mapReducer";
import { Fraction, MapState, RegionData, RegionDict, RegionStateDerived } from "../types/types";
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

export const useRegionStore = () => {
  const { state, dispatch } = useStore();
  return { 
    regionDict: state.regionDict, 
    dispatch
   };
};

export const useRegionStateDerived = (region: RegionData): RegionStateDerived => {
  const { state } = useStore();
  const { selected, regionDict } = state;

  const getPartisanNeighbors = (region: RegionData) =>
    region.neighbors.filter(neighbor => regionDict[neighbor].fraction === Fraction.Partisan && regionDict[neighbor].garrison.infantry > 0)

  const partisanNeighbors = getPartisanNeighbors(region)

  const attackable = selected?.name === region.name
    && selected.fraction === Fraction.German 
    && getPartisanNeighbors(selected).length > 0

  return { 
    partisanNeighbors,
    attackable,
    attacked: Boolean(regionDict[region.name].attackingForces),
  }
}
