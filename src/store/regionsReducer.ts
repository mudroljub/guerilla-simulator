import { RegionData, Status } from "../types/types";

export type RegionAction =
  | { type: "ATTACK_REGION"; region: string }
  | { type: "REINFORCE_REGION"; region: string; troops: number };

type Regions = Record<string, RegionData>

export function regionsReducer(regions: Regions, action: RegionAction): Record<string, RegionData> {
  switch (action.type) {
    case "ATTACK_REGION":
      return {
        ...regions,
        [action.region]: {
          ...regions[action.region],
          status: Status.Attacked,
          garrison: regions[action.region].garrison - 1,
        },
      };

    case "REINFORCE_REGION":
      return {
        ...regions,
        [action.region]: {
          ...regions[action.region],
          garrison: regions[action.region].garrison + action.troops,
        },
      };

    default:
      return regions;
  }
}