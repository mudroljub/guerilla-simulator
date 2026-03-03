import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction } from "./mapReducer";
import { Fraction, MapState, RegionState, RegionData, RegionDict, RegionStateDerived } from "../types/types";
import { initGarrison } from "../utils/initGarrison";

interface Store {
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<Store | undefined>(undefined);

const initRegionState = (region: RegionData) : RegionState => {
    const fraction = region.size < 0.1 && Math.random() < 0.1
        ? Fraction.Partisan
        : Fraction.German

    return {
      ...region,
      fraction,
      garrison: initGarrison(region.population, fraction),
    }
}

const initialState = (regions: RegionData[]): MapState => ({
  selected: null,
  regionDict: regions.reduce((dict, region) => ({
    ...dict,
    [region.name]: initRegionState(region),
  }), {} as RegionDict),
});

export function Provider({ regions, children }: { regions: RegionData[]; children: ReactNode }) {
  const [mapState, dispatch] = useReducer(mapReducer, regions, initialState);

  const value = useMemo(() => ({ mapState, dispatch }), [mapState]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useStore must be used within MapProvider");
  return ctx;
};

export const useRegionStore = () => {
  const { mapState, dispatch } = useStore();
  return { 
    regionDict: mapState.regionDict, 
    dispatch
   };
};

export const useRegionStateDerived = (region: RegionData): RegionStateDerived => {
  const { mapState } = useStore();
  const { selected, regionDict } = mapState;

  const getPartisanNeighbors = (region: RegionData) =>
    region.neighbors.filter(neighbor => regionDict[neighbor].fraction === Fraction.Partisan && regionDict[neighbor].garrison.infantry > 0)

  const partisanNeighbors = getPartisanNeighbors(region)

  const attackable = selected?.name === region.name
    && regionDict[selected.name].fraction === Fraction.German 
    && getPartisanNeighbors(selected).length > 0

  return { 
    partisanNeighbors,
    attackable,
    attacked: Boolean(regionDict[region.name].attackingForces),
  }
}
