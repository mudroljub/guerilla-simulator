import React, { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";
import { regionReducer, RegionAction, RegionStateMap } from "./regionReducer";
import { IRegion } from "../types/types";

interface RegionsContextValue {
  regionsBase: IRegion[];
  regionState: RegionStateMap;
  dispatch: Dispatch<RegionAction>;
}

const RegionsContext = createContext<RegionsContextValue | undefined>(undefined);

const buildInitialState = (regions: IRegion[]): RegionStateMap => 
  regions.reduce((acc, r) => ({ ...acc, [r.name]: r.initialState }), {});

interface RegionsProviderProps {
  regionsBase: IRegion[];
  children: ReactNode;
}

export function RegionsProvider({ regionsBase, children }: RegionsProviderProps) {
  const [regionState, dispatch] = useReducer(
    regionReducer, 
    regionsBase, 
    buildInitialState
  );

  const contextValue = useMemo(() => ({
    regionsBase,
    regionState,
    dispatch
  }), [regionsBase, regionState]);

  return (
    <RegionsContext.Provider value={contextValue}>
      {children}
    </RegionsContext.Provider>
  );
}

export function useRegions() {
  const ctx = useContext(RegionsContext);
  if (ctx === undefined) {
    throw new Error("useRegions must be used within a RegionsProvider");
  }
  return ctx;
}