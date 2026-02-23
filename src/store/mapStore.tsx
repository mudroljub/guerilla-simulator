import React, { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { mapReducer, MapAction, MapState } from "./mapReducer";
import { IRegion } from "../types/types";

interface MapStore {
  regionsBase: IRegion[];
  mapState: MapState;
  dispatch: Dispatch<MapAction>;
}

const MapContext = createContext<MapStore | undefined>(undefined);

const initialState = (regions: IRegion[]): MapState => 
  Object.fromEntries(regions.map(r => [r.name, r.initialState]));

export function MapProvider({ regionsBase, children }: { regionsBase: IRegion[]; children: ReactNode }) {
  const [mapState, dispatch] = useReducer(mapReducer, regionsBase, initialState);

  const value = useMemo(() => ({ regionsBase, mapState, dispatch }), [regionsBase, mapState]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useMapStore = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapStore must be used within MapProvider");
  return ctx;
};