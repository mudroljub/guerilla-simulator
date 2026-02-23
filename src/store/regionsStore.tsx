import React from "react";
import { regionReducer, RegionAction, RegionStateMap } from "./regionReducer";
import { IRegion } from "../types/types";

type Ctx = {
  regionsBase: IRegion[];
  regionState: RegionStateMap;
  dispatch: React.Dispatch<RegionAction>;
};

const RegionsContext = React.createContext<Ctx | null>(null);

function buildInitialState(regions: IRegion[]): RegionStateMap {
  const m: RegionStateMap = {};
  for (const r of regions) m[r.name] = r.state;
  return m;
}

export function RegionsProvider({
  regionsBase,
  children,
}: {
  regionsBase: IRegion[];
  children: React.ReactNode;
}) {
  const initial = React.useMemo(
    () => buildInitialState(regionsBase),
    [regionsBase],
  );
  const [regionState, dispatch] = React.useReducer(regionReducer, initial);

  return (
    <RegionsContext.Provider value={{ regionsBase, regionState, dispatch }}>
      {children}
    </RegionsContext.Provider>
  );
}

export function useRegions() {
  const ctx = React.useContext(RegionsContext);
  if (!ctx) throw new Error("useRegions must be used within RegionsProvider");
  return ctx;
}
